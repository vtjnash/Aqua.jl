"""
    Aqua.test_persistent_tasks(package)

Test whether loading `package` creates persistent `Task`s
which may block precompilation of dependent packages.
See also [`Aqua.find_persistent_tasks_deps`](@ref).

If you provide an optional `expr`, this tests whether loading `package` and running `expr`
creates persistent `Task`s. For example, you might start and shutdown a web server, and
this will test that there aren't any persistent `Task`s.

On Julia version 1.9 and before, this test always succeeds.

# Arguments
- `package`: a top-level `Module` or `Base.PkgId`.

# Keyword Arguments
- `broken::Bool = false`: If true, it uses `@test_broken` instead of
  `@test`.
- `tmax::Real = 5`: the maximum time (in seconds) to wait after loading the
  package before forcibly shutting down the precompilation process (triggering
  a test failure).
- `expr::Expr = quote end`: An expression to run in the precompile package.

!!! note

    `Aqua.test_persistent_tasks(package)` creates a package with `package`
    as a dependency and runs the precompilation process.
    This requires that `package` is instantiable with the information in the
    `Project.toml` file alone.
    In particular, this will not work if some of `package`'s dependencies are `dev`ed
    packages or are given as a local path or a git repository in the `Manifest.toml`.
"""
function test_persistent_tasks(package::PkgId; broken::Bool = false, kwargs...)
    if broken
        @test_broken !has_persistent_tasks(package; kwargs...)
    else
        @test !has_persistent_tasks(package; kwargs...)
    end
end

function test_persistent_tasks(package::Module; kwargs...)
    test_persistent_tasks(PkgId(package); kwargs...)
end

function has_persistent_tasks(package::PkgId; expr::Expr = quote end, tmax = 10)
    root_project_path, found = root_project_toml(package)
    found || error("Unable to locate Project.toml")
    return !precompile_wrapper(root_project_path, tmax, expr)
end

"""
    Aqua.find_persistent_tasks_deps(package; broken = Dict{String,Bool}(), kwargs...)

Test all the dependencies of `package` with [`Aqua.test_persistent_tasks`](@ref).
On Julia 1.10 and higher, it returns a list of all dependencies failing the test.
These are likely the ones blocking precompilation of your package.

Any additional kwargs (e.g., `tmax`) are passed to [`Aqua.test_persistent_tasks`](@ref).
"""
function find_persistent_tasks_deps(package::PkgId; kwargs...)
    root_project_path, found = root_project_toml(package)
    found || error("Unable to locate Project.toml")
    prj = TOML.parsefile(root_project_path)
    deps = get(prj, "deps", Dict{String,Any}())
    filter!(deps) do (name, uuid)
        id = PkgId(UUID(uuid), name)
        return has_persistent_tasks(id; kwargs...)
    end
    return String[name for (name, _) in deps]
end

function find_persistent_tasks_deps(package::Module; kwargs...)
    find_persistent_tasks_deps(PkgId(package); kwargs...)
end

function precompile_wrapper(project, tmax, expr)
    @static if VERSION < v"1.10.0-"
        return true
    end
    prev_project = Base.active_project()::String
    isdefined(Pkg, :respect_sysimage_versions) && Pkg.respect_sysimage_versions(false)
    try
        pkgdir = dirname(project)
        pkgname = get(TOML.parsefile(project), "name", nothing)
        if isnothing(pkgname)
            @error "Unable to locate package name in $project"
            return false
        end
        wrapperdir = tempname()
        wrappername, _ = only(Pkg.generate(wrapperdir; io = devnull))
        Pkg.activate(wrapperdir; io = devnull)
        Pkg.develop(PackageSpec(path = pkgdir); io = devnull)
        statusfile = joinpath(wrapperdir, "done.log")
        open(joinpath(wrapperdir, "src", wrappername * ".jl"), "w") do io
            println(
                io,
                """
module $wrappername
using $pkgname
$expr
# Signal Aqua from the precompilation process that we've finished loading the package
open("$(escape_string(statusfile))", "w") do io
    println(io, "done")
    flush(io)
end
end
""",
            )
        end
        # Precompile the wrapper package
        cmd = `$(Base.julia_cmd()) --project=$wrapperdir -e 'push!(LOAD_PATH, "@stdlib"); using Pkg; Pkg.precompile(; io = devnull)'`
        proc = run(cmd, stdin, stdout, stderr; wait = false)
        while !isfile(statusfile) && process_running(proc)
            sleep(0.5)
        end
        if !isfile(statusfile)
            @error "Unexpected error: $statusfile was not created, but precompilation exited"
            return false
        end
        # Check whether precompilation finishes in the required time
        t = time()
        while process_running(proc) && time() - t < tmax
            sleep(0.1)
        end
        success = !process_running(proc)
        if !success
            # SIGKILL to prevent julia from printing the SIG 15 handler, which can
            # misleadingly look like it's caused by an issue in the user's program.
            kill(proc, Base.SIGKILL)
        end
        return success
    finally
        isdefined(Pkg, :respect_sysimage_versions) && Pkg.respect_sysimage_versions(true)
        Pkg.activate(prev_project; io = devnull)
    end
end
