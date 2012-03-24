task :default => :build

desc "Built project for deployment"
task :build => [:copy_vendor, :copy_src] do
  puts "Dragon.js built for deployment"
end

desc "Copy source files to the example directory"
task :copy_src do
  cp('./src/dragon.js', './example/js/libs/dragon.js')
end

desc "Copy vendor files to the example directory"
task :copy_vendor do
end

begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end