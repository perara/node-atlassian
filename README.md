# node-atlassian
This package provides an api for atlassian tools, currently supports:
* Bamboo
* Stash

Also the package does not fully cover the API of these two. I accept pull requests and will merge it quickly into the master branch, so please contribute if you do any improvements.

## Installing
``npm install node-atlassian --save``

#### Initializing
```
let node_atlassian = require("node-atlassian");
let Atlassian = new node_atlassian("username", "password", "http://stash-or-bamboo.com");
```
All functions returns a promise, but it is preffered to use with for example co

#### Bamboo API
**Projects** ``let projects = yield Atlassian.Bamboo.projects();``

**Plans** ``let plans = yield Atlassian.Bamboo.plans(projects[0].key);``

**Branches** ``let branches = yield Atlassian.Bamboo.branches(plans[0].key);``

**Build** ``let build = yield Atlassian.Bamboo.build(branches[0].key);``

**Build Status** ``let status = yield Atlassian.Bamboo.build_status(build.planKey, build.buildNumber);``



#### Stash API
**Projects** ``let projects = yield Atlassian.Stash.projects();``

**Project View** ``let project_view = yield Atlassian.Stash.project_view(projects[0].key);``

**Repositories** ``let repositories = yield Atlassian.Stash.repositories(projects[0].key);``

**Branches** ``let branches = yield Atlassian.Stash.branches(projects[0].key, repositories[0].slug);``

# Licence
The MIT License (MIT)

Copyright (c) 2015 Per-Arne Andersen

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
