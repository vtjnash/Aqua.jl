var documenterSearchIndex = {"docs":
[{"location":"#Aqua.jl","page":"Home","title":"Aqua.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Modules = [Aqua]\nPrivate = false","category":"page"},{"location":"#Aqua.Aqua","page":"Home","title":"Aqua.Aqua","text":"Aqua.jl: Auto QUality Assurance for Julia packages\n\n(Image: Stable) (Image: Dev) (Image: GitHub Actions) (Image: Codecov) (Image: GitHub commits since tagged version) (Image: Aqua QA)\n\nAqua.jl provides functions to run a few automatable checks for Julia packages:\n\nThere are no method ambiguities.\nThere are no undefined exports.\nThere are no unbound type parameters.\nThere are no stale dependencies listed in Project.toml.\nCheck that test target of the root project Project.toml and test project (test/Project.toml) are consistent.\nCheck that all external packages listed in deps have corresponding compat entry.\nProject.toml formatting is compatible with Pkg.jl output.\n\nSee more in the documentation.\n\nQuick usage\n\nCall Aqua.test_all(YourPackage) from test/runtests.jl, e.g.,\n\nusing YourPackage\nusing Aqua\nAqua.test_all(YourPackage)\n\nSpecifying Aqua version\n\nTo avoid breaking test when a new Aqua.jl version is released, it is recommended to add version bound for Aqua.jl in test/Project.toml:\n\n[deps]\nAqua = \"4c88cf16-eb10-579e-8560-4a9242c79595\"\nTest = \"8dfed614-e22c-5e08-85e1-65c5234f0b40\"\n\n[compat]\nAqua = \"0.5\"\n\nBadge\n\nYou can add the following line in README.md to include Aqua.jl badge:\n\n[![Aqua QA](https://raw.githubusercontent.com/JuliaTesting/Aqua.jl/master/badge.svg)](https://github.com/JuliaTesting/Aqua.jl)\n\nwhich is rendered as\n\n(Image: Aqua QA)\n\n\n\n\n\n","category":"module"},{"location":"","page":"Home","title":"Home","text":"Modules = [Aqua]\nPublic = false\nFilter = t -> startswith(String(nameof(t)), \"test_\")","category":"page"},{"location":"#Aqua.test_all-Tuple{Module}","page":"Home","title":"Aqua.test_all","text":"test_all(testtarget::Module)\n\nRun following tests in isolated testset:\n\ntest_ambiguities([testtarget, Base])\ntest_unbound_args(testtarget)\ntest_undefined_exports(testtarget)\ntest_project_extras(testtarget) (optional)\ntest_stale_deps(testtarget) (optional)\ntest_deps_compat(testtarget) (optional)\ntest_project_toml_formatting(testtarget) (optional)\n\ncompat: Aqua.jl 0.5\nSince Aqua.jl 0.5:test_all runs test_ambiguities with Core.  This  means method ambiguities of constructors can now be detected.  In Aqua.jl 0.4, test_ambiguities was invoked with  [testtarget, Base].\ntest_all runs test_stale_deps.  In Aqua.jl 0.4, this check was opt-in.\n\nThe keyword argument $x (e.g., ambiguities) can be used to control whether or not to run test_$x (e.g., test_ambiguities). If test_$x supports keyword arguments, a NamedTuple can also be passed to $x to specify the keyword arguments for test_$x.\n\nKeyword Arguments\n\nambiguities = true\nunbound_args = true\nundefined_exports = true\nproject_extras = false\nstale_deps = false\ndeps_compat = false\nproject_toml_formatting = false\n\n\n\n\n\n","category":"method"},{"location":"#Aqua.test_ambiguities-Tuple{Any}","page":"Home","title":"Aqua.test_ambiguities","text":"test_ambiguities(package::Union{Module, PkgId})\ntest_ambiguities(packages::Vector{Union{Module, PkgId}})\n\nTest that there is no method ambiguities in given package(s).  It calls Test.detect_ambiguities in a separated clean process to avoid false-positive.\n\nKeyword Arguments\n\ncolor::Union{Bool, Nothing} = nothing: Enable/disable colorful output if a Bool.  nothing (default) means to inherit the setting in the current process.\nexclude::AbstractArray = []: A vector of functions or types to be excluded from ambiguity testing.  A function means to exclude all its methods.  A type means to exclude all its methods of the callable (sometimes also called \"functor\").  That is to say, MyModule.MyType means to ignore ambiguities between (::MyType)(x, y::Int) and (::MyType)(x::Int, y).  Note that there is no way to exclude the constructor of a specific type at the moment.\nrecursive::Bool = true: Passed to Test.detect_ambiguities. Note that the default here (true) is different from detect_ambiguities.  This is for testing ambiguities in methods defined in all sub-modules.\nOther keyword arguments such as imported and ambiguous_bottom are passed to Test.detect_ambiguities as-is.\n\n\n\n\n\n","category":"method"},{"location":"#Aqua.test_deps_compat","page":"Home","title":"Aqua.test_deps_compat","text":"Aqua.test_deps_compat(package)\n\nTest that Project.toml of package list all compat for deps.\n\nArguments\n\npackages: a top-level Module, a Base.PkgId, or a collection of them.\n\n\n\n\n\n","category":"function"},{"location":"#Aqua.test_project_extras-Tuple{Any}","page":"Home","title":"Aqua.test_project_extras","text":"test_project_extras(package::Union{Module, PkgId})\ntest_project_extras(packages::Vector{Union{Module, PkgId}})\n\nCheck that test target of the root project and test project (test/Project.toml) are consistent.  This is useful for supporting Julia < 1.2 while recording test-only dependency compatibility in test/Project.toml.\n\n\n\n\n\n","category":"method"},{"location":"#Aqua.test_project_toml_formatting-Tuple{Any}","page":"Home","title":"Aqua.test_project_toml_formatting","text":"Aqua.test_project_toml_formatting(packages)\n\n\n\n\n\n","category":"method"},{"location":"#Aqua.test_stale_deps","page":"Home","title":"Aqua.test_stale_deps","text":"Aqua.test_stale_deps(package; [ignore])\n\nTest that package loads all dependencies listed in Project.toml.\n\nnote: Known bug\nCurrently, Aqua.test_stale_deps does not detect stale dependencies when they are stdlib.  This is considered a bug and may be fixed in the future.  Such a release is considered non-breaking.\n\nArguments\n\npackages: a top-level Module, a Base.PkgId, or a collection of them.\n\nKeyword Arguments\n\nignore::Vector{Symbol}: names of dependent packages to be ignored.\n\n\n\n\n\n","category":"function"},{"location":"#Aqua.test_unbound_args-Tuple{Module}","page":"Home","title":"Aqua.test_unbound_args","text":"test_unbound_args(module::Module)\n\nTest that all methods in module and its submodules do not have unbound type parameter.\n\n\n\n\n\n","category":"method"},{"location":"#Aqua.test_undefined_exports-Tuple{Module}","page":"Home","title":"Aqua.test_undefined_exports","text":"test_undefined_exports(module::Module)\n\nTest that all exported names in module actually exist.\n\n\n\n\n\n","category":"method"},{"location":"internals/#Internals","page":"Internals","title":"Internals","text":"","category":"section"},{"location":"internals/","page":"Internals","title":"Internals","text":"Modules = [Aqua]\nPublic = false\nFilter = t -> !startswith(String(nameof(t)), \"test_\")","category":"page"},{"location":"internals/#Aqua.trydiff-Tuple{Pair{var\"#s13\",var\"#s30\"} where var\"#s30\"<:AbstractString where var\"#s13\"<:AbstractString,Pair{var\"#s31\",var\"#s32\"} where var\"#s32\"<:AbstractString where var\"#s31\"<:AbstractString}","page":"Internals","title":"Aqua.trydiff","text":"trydiff(label_a => text_a, label_b => text_b) -> string or exception\n\n\n\n\n\n","category":"method"},{"location":"internals/#Aqua.undefined_exports-Tuple{Module}","page":"Internals","title":"Aqua.undefined_exports","text":"undefined_exports(m::Module) :: Vector{Symbol}\n\n\n\n\n\n","category":"method"}]
}
