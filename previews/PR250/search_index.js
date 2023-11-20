var documenterSearchIndex = {"docs":
[{"location":"persistent_tasks/#Persistent-Tasks","page":"Persistent Tasks","title":"Persistent Tasks","text":"","category":"section"},{"location":"persistent_tasks/","page":"Persistent Tasks","title":"Persistent Tasks","text":"Aqua.test_persistent_tasks\nAqua.find_persistent_tasks_deps","category":"page"},{"location":"persistent_tasks/#Aqua.test_persistent_tasks","page":"Persistent Tasks","title":"Aqua.test_persistent_tasks","text":"Aqua.test_persistent_tasks(package)\n\nTest whether loading package creates persistent Tasks which may block precompilation of dependent packages. See also Aqua.find_persistent_tasks_deps.\n\nMotivation\n\nJulia 1.10 and higher wait for all running Tasks to finish before writing out the precompiled (cached) version of the package. One consequence is that a package that launches Tasks in its __init__ function may precompile successfully, but block precompilation of any packages that depend on it.\n\nExample\n\nLet's create a dummy package, PkgA, that launches a persistent Task:\n\nmodule PkgA\nconst t = Ref{Any}()   # to prevent the Timer from being garbage-collected\n__init__() = t[] = Timer(0.1; interval=1)   # create a persistent `Timer` `Task`\nend\n\nPkgA will precompile successfully, because PkgA.__init__() does not run when PkgA is precompiled. However,\n\nmodule PkgB\nusing PkgA\nend\n\nfails to precompile: using PkgA runs PkgA.__init__(), which leaves the Timer Task running, and that causes precompilation of PkgB to hang.\n\nHow the test works\n\nThis test works by launching a Julia process that tries to precompile a dummy package similar to PkgB above, modified to signal back to Aqua when PkgA has finished loading. The test fails if the gap between loading PkgA and finishing precompilation exceeds time tmax.\n\nHow to fix failing packages\n\nOften, the easiest fix is to modify the __init__ function to check whether the Julia process is precompiling some other package; if so, don't launch the persistent Tasks.\n\nfunction __init__()\n    # Other setup code here\n    if ccall(:jl_generating_output, Cint, ()) == 0   # if we're not precompiling...\n        # launch persistent tasks here\n    end\nend\n\nIn more complex cases, you may need to set up independently-callable functions to launch the tasks and set conditions that allow them to cleanly exit.\n\nOn Julia version 1.9 and before, this test always succeeds.\n\nArguments\n\npackage: a top-level Module or Base.PkgId.\n\nKeyword Arguments\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test.\ntmax::Real = 5: the maximum time (in seconds) to wait after loading the package before forcibly shutting down the precompilation process (triggering a test failure).\n\n\n\n\n\n","category":"function"},{"location":"persistent_tasks/#Aqua.find_persistent_tasks_deps","page":"Persistent Tasks","title":"Aqua.find_persistent_tasks_deps","text":"Aqua.find_persistent_tasks_deps(package; broken = Dict{String,Bool}(), kwargs...)\n\nTest all the dependencies of package with Aqua.test_persistent_tasks. On Julia 1.10 and higher, it returns a list of all dependencies failing the test. These are likely the ones blocking precompilation of your package.\n\nAny additional kwargs (e.g., tmax) are passed to Aqua.test_persistent_tasks.\n\n\n\n\n\n","category":"function"},{"location":"deps_compat/#Compat-entries","page":"Compat entries","title":"Compat entries","text":"","category":"section"},{"location":"deps_compat/","page":"Compat entries","title":"Compat entries","text":"Aqua.test_deps_compat","category":"page"},{"location":"deps_compat/#Aqua.test_deps_compat","page":"Compat entries","title":"Aqua.test_deps_compat","text":"Aqua.test_deps_compat(package)\n\nTest that the Project.toml of package has a compat entry for each package listed under deps and for julia.\n\nArguments\n\npackages: a top-level Module, a Base.PkgId, or a collection of them.\n\nKeyword Arguments\n\nTest choosers\n\ncheck_julia = true: If true, additionally check for a compat entry for \"julia\".\ncheck_extras = true: If true, additionally check \"extras\". A NamedTuple can be used to pass keyword arguments with test options (see below).\ncheck_weakdeps = true: If true, additionally check \"weakdeps\". A NamedTuple can be used to pass keyword arguments with test options (see below).\n\nTest options\n\nIf these keyword arguments are set directly, they only apply to the standard test for \"deps\". To apply them to \"extras\" and \"weakdeps\", pass them as a NamedTuple to the corresponding check_$x keyword argument.\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test for \"deps\".\nignore::Vector{Symbol}: names of dependent packages to be ignored.\n\n\n\n\n\n","category":"function"},{"location":"piracies/#Type-piracy","page":"Type piracy","title":"Type piracy","text":"","category":"section"},{"location":"piracies/","page":"Type piracy","title":"Type piracy","text":"Aqua.test_piracies","category":"page"},{"location":"piracies/#Aqua.test_piracies","page":"Type piracy","title":"Aqua.test_piracies","text":"test_piracies(m::Module)\n\nTest that m does not commit type piracies. See Julia documentation for more information about type piracy.\n\nKeyword Arguments\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test.\nskip_deprecated::Bool = true: If true, it does not check deprecated methods.\ntreat_as_own = Union{Function, Type}[]: The types in this container  are considered to be \"owned\" by the module m. This is useful for  testing packages that deliberately commit some type piracies, e.g. modules adding higher-level functionality to a lightweight C-wrapper, or packages that are extending StatsAPI.jl.\n\n\n\n\n\n","category":"function"},{"location":"project_extras/#Project.toml-extras","page":"Project.toml extras","title":"Project.toml extras","text":"","category":"section"},{"location":"project_extras/","page":"Project.toml extras","title":"Project.toml extras","text":"Aqua.test_project_extras","category":"page"},{"location":"project_extras/#Aqua.test_project_extras","page":"Project.toml extras","title":"Aqua.test_project_extras","text":"test_project_extras(package::Union{Module, PkgId})\ntest_project_extras(packages::Vector{Union{Module, PkgId}})\n\nCheck that test target of the root project and test project (test/Project.toml) are consistent.  This is useful for supporting Julia < 1.2 while recording test-only dependency compatibility in test/Project.toml.\n\n\n\n\n\n","category":"function"},{"location":"unbound_args/#Unbound-Type-Parameters","page":"Unbound Type Parameters","title":"Unbound Type Parameters","text":"","category":"section"},{"location":"unbound_args/","page":"Unbound Type Parameters","title":"Unbound Type Parameters","text":"Aqua.test_unbound_args","category":"page"},{"location":"unbound_args/#Aqua.test_unbound_args","page":"Unbound Type Parameters","title":"Aqua.test_unbound_args","text":"test_unbound_args(module::Module)\n\nTest that all methods in module and its submodules do not have unbound type parameters. An unbound type parameter is a type parameter with a where, that does not occur in the signature of some dispatch of the method.\n\nKeyword Arguments\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test.\n\nFor example, the following methods each have T as an unbound type parameter:\n\nf(x::Int) where {T} = do_something(x)\n\ng(x::S) where {S < : Number, T <: Number} = do_something(x)\n\nh(x::T...) where {T} = do_something(x)\n\nIn the cases of f and g above, the unbound type parameter T is neither present in the signature of the methods nor as a bound of another type parameter. Here, the type parameter T can be removed without changing any semantics.\n\nFor signatures with Vararg (cf. h above), the type parameter unbound for the  zero-argument case (e.g. h()). A possible fix would be to replace h by two methods\n\nh() = do_something(T[])\nh(x1::T, x2::T...) = do_something(T[x1, x2...])\n\n\n\n\n\n","category":"function"},{"location":"stale_deps/#Stale-dependencies","page":"Stale dependencies","title":"Stale dependencies","text":"","category":"section"},{"location":"stale_deps/","page":"Stale dependencies","title":"Stale dependencies","text":"Aqua.test_stale_deps","category":"page"},{"location":"stale_deps/#Aqua.test_stale_deps","page":"Stale dependencies","title":"Aqua.test_stale_deps","text":"Aqua.test_stale_deps(package; [ignore])\n\nTest that package loads all dependencies listed in Project.toml. Note that this does not imply that package loads the dependencies directly, this can be achieved via transitivity as well.\n\nnote: Weak dependencies and extensions\nDue to the automatic loading of package extensions once all of their trigger dependencies are loaded, Aqua.jl can, by design of julia, not check if a package extension indeed loads all of its trigger dependencies using import or using. \n\nwarning: Known bug\nCurrently, Aqua.test_stale_deps does not detect stale dependencies when they are stdlib.  This is considered a bug and may be fixed in the future.  Such a release is considered non-breaking.\n\nArguments\n\npackages: a top-level Module, a Base.PkgId, or a collection of them.\n\nKeyword Arguments\n\nignore::Vector{Symbol}: names of dependent packages to be ignored.\n\n\n\n\n\n","category":"function"},{"location":"ambiguities/#Ambiguities","page":"Ambiguities","title":"Ambiguities","text":"","category":"section"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"Method ambiguities are cases where multiple methods are applicable to a given set of arguments, without having a most specific method.","category":"page"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"One easy example is the following:","category":"page"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"f(x::Int, y::Integer) = 1\nf(x::Integer, y::Int) = 2\n\nprintln(f(1, 2))","category":"page"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"This will throw an MethodError because both methods are equally specific. The solution is to add a third method:","category":"page"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"f(x::Int, y::Int) = ? # `?` is dependent on the use case, most times it will be `1` or `2`","category":"page"},{"location":"ambiguities/#test_ambiguities","page":"Ambiguities","title":"Test function","text":"","category":"section"},{"location":"ambiguities/","page":"Ambiguities","title":"Ambiguities","text":"Aqua.test_ambiguities","category":"page"},{"location":"ambiguities/#Aqua.test_ambiguities","page":"Ambiguities","title":"Aqua.test_ambiguities","text":"test_ambiguities(package::Union{Module, PkgId})\ntest_ambiguities(packages::Vector{Union{Module, PkgId}})\n\nTest that there is no method ambiguities in given package(s).  It calls Test.detect_ambiguities in a separated clean process to avoid false-positives.\n\nKeyword Arguments\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test.\ncolor::Union{Bool, Nothing} = nothing: Enable/disable colorful output if a Bool.  nothing (default) means to inherit the setting in the current process.\nexclude::AbstractVector = []: A vector of functions or types to be excluded from ambiguity testing.  A function means to exclude all its methods.  A type means to exclude all its methods of the callable (sometimes also called \"functor\") and the constructor.   That is to say, MyModule.MyType means to ignore ambiguities between  (::MyType)(x, y::Int) and (::MyType)(x::Int, y).\nrecursive::Bool = true: Passed to Test.detect_ambiguities. Note that the default here (true) is different from detect_ambiguities.  This is for testing ambiguities in methods defined in all sub-modules.\nOther keyword arguments such as imported and ambiguous_bottom are passed to Test.detect_ambiguities as-is.\n\n\n\n\n\n","category":"function"},{"location":"exports/#Undefined-exports","page":"Undefined exports","title":"Undefined exports","text":"","category":"section"},{"location":"exports/","page":"Undefined exports","title":"Undefined exports","text":"Aqua.test_undefined_exports","category":"page"},{"location":"exports/#Aqua.test_undefined_exports","page":"Undefined exports","title":"Aqua.test_undefined_exports","text":"test_undefined_exports(module::Module)\n\nTest that all exported names in module actually exist.\n\nKeyword Arguments\n\nbroken::Bool = false: If true, it uses @test_broken instead of @test.\n\n\n\n\n\n","category":"function"},{"location":"test_all/#test_all","page":"Test everything","title":"Test everything","text":"","category":"section"},{"location":"test_all/","page":"Test everything","title":"Test everything","text":"Aqua.test_all","category":"page"},{"location":"test_all/#Aqua.test_all","page":"Test everything","title":"Aqua.test_all","text":"test_all(testtarget::Module)\n\nRun following tests in isolated testset:\n\ntest_ambiguities([testtarget, Base, Core])\ntest_unbound_args(testtarget)\ntest_undefined_exports(testtarget)\ntest_project_extras(testtarget)\ntest_stale_deps(testtarget)\ntest_deps_compat(testtarget)\ntest_piracies(testtarget)\ntest_persistent_tasks(testtarget)\n\nThe keyword argument $x (e.g., ambiguities) can be used to control whether or not to run test_$x (e.g., test_ambiguities). If test_$x supports keyword arguments, a NamedTuple can also be passed to $x to specify the keyword arguments for test_$x.\n\nKeyword Arguments\n\nambiguities = true\nunbound_args = true\nundefined_exports = true\nproject_extras = true\nstale_deps = true\ndeps_compat = true\npiracies = true\npersistent_tasks = true\n\n\n\n\n\n","category":"function"},{"location":"#Aqua.jl:-*A*uto-*QU*ality-*A*ssurance-for-Julia-packages","page":"Home","title":"Aqua.jl: Auto QUality Assurance for Julia packages","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Aqua.jl provides functions to run a few automatable checks for Julia packages:","category":"page"},{"location":"","page":"Home","title":"Home","text":"There are no method ambiguities.\nThere are no undefined exports.\nThere are no unbound type parameters.\nThere are no stale dependencies listed in Project.toml.\nCheck that test target of the root project Project.toml and test project (test/Project.toml) are consistent.\nCheck that all external packages listed in deps have corresponding compat entries.\nThere are no \"obvious\" type piracies.\nThe package does not create any persistent Tasks that might block precompilation of dependencies.","category":"page"},{"location":"#Quick-usage","page":"Home","title":"Quick usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Call Aqua.test_all(YourPackage) from the REPL, e.g.,","category":"page"},{"location":"","page":"Home","title":"Home","text":"using YourPackage\nusing Aqua\nAqua.test_all(YourPackage)","category":"page"},{"location":"#How-to-add-Aqua.jl...","page":"Home","title":"How to add Aqua.jl...","text":"","category":"section"},{"location":"#...as-a-test-dependency?","page":"Home","title":"...as a test dependency?","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"There are two ways to add Aqua.jl as a test dependency to your package. To avoid breaking tests when a new Aqua.jl version is released, it is recommended to add a version bound for Aqua.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"In YourPackage/test/Project.toml, add Aqua.jl to [dep] and [compat] sections, like\n[deps]\nAqua = \"4c88cf16-eb10-579e-8560-4a9242c79595\"\nTest = \"8dfed614-e22c-5e08-85e1-65c5234f0b40\"\n\n[compat]\nAqua = \"0.8\"\nIn YourPackage/Project.toml, add Aqua.jl to [compat] and [extras] section and the test target, like\n[compat]\nAqua = \"0.8\"\n\n[extras]\nAqua = \"4c88cf16-eb10-579e-8560-4a9242c79595\"\nTest = \"8dfed614-e22c-5e08-85e1-65c5234f0b40\"\n\n[targets]\ntest = [\"Aqua\", \"Test\"]","category":"page"},{"location":"","page":"Home","title":"Home","text":"If your package supports Julia pre-1.2, you need to use the second approach, although you can use both approaches at the same time.","category":"page"},{"location":"","page":"Home","title":"Home","text":"warning: Warning\nIn normal use, Aqua.jl should not be added to [deps] in YourPackage/Project.toml!","category":"page"},{"location":"#...to-your-tests?","page":"Home","title":"...to your tests?","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"It is recommended to create a separate file YourPackage/test/Aqua.jl that gets included in YourPackage/test/runtests.jl with either","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Aqua\nAqua.test_all(YourPackage)","category":"page"},{"location":"","page":"Home","title":"Home","text":"or some fine-grained checks with options, e.g.,","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Aqua\n\n@testset \"Aqua.jl\" begin\n  Aqua.test_all(\n    YourPackage;\n    ambiguities=(exclude=[SomePackage.some_function], broken=true),\n    stale_deps=(ignore=[:SomePackage],),\n    deps_compat=(ignore=[:SomeOtherPackage],),\n    piracies=false,\n  )\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"Note, that for all tests with no explicit options provided, the default options are used.","category":"page"},{"location":"","page":"Home","title":"Home","text":"For more details on the options, see the respective functions here.","category":"page"},{"location":"#Examples","page":"Home","title":"Examples","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"The following is a small selection of packages that use Aqua.jl:","category":"page"},{"location":"","page":"Home","title":"Home","text":"GAP.jl\nHecke.jl\nOscar.jl","category":"page"}]
}
