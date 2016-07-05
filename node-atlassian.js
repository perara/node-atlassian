let axios = require("axios");
const url = require("url");
let co = require("co");

class WebClient {


    constructor(settings) {
        this.settings = settings;

        this.instance = axios.create({
            baseURL: settings.base_url,
            timeout: 1000,
            headers: {
                'Authorization': 'Basic ' + new Buffer(settings.username + ":" + settings.password).toString('base64'),
                'Content-Type': 'application/json'
            }
        });
    }

    get(url, is_paged, opts){
        return co(this._get, this, url, opts, is_paged)
    }

    *_get(_this, url, opts, is_paged)
    {
        var bamboo = (opts && opts.bamboo);

        // Stash
        if(!bamboo) {

            if (is_paged) {
                let is_last_page = false;
                let max_items = Number.MAX_SAFE_INTEGER;
                let page = 0;

                if (opts && opts.max_items) {
                    max_items = opts.max_items;
                }

                let ret_data = [];
                while (!is_last_page) {
                    let res = yield _this.instance.get(url, {
                        params: {
                            start: page
                        }
                    });
                    let data = res.data;

                    console.log(data)

                    ret_data.push.apply(ret_data, data.values);

                    is_last_page = data.isLastPage;
                    page = data.nextPageStart;
                }

                return ret_data;

            }
            else {
                let res = yield _this.instance.get(url);
                return res.data
            }
        }
        else if(bamboo) // Bamboo
        {


            if (is_paged) {

                let max_result = 25;
                let start_index = 0;
                let ret_data = [];
                let size = max_result;

                while(size === max_result) {

                    let res = yield _this.instance.get(url, {
                        params: {
                            'max-result': max_result,
                            'start-index': start_index
                        }
                    });

                    let expand_1 = res.data.expand;
                    let data = res.data[expand_1];

                    size = data.size;

                    ret_data.push.apply(ret_data, data[data.expand]);


                    start_index += size

                }
                return ret_data;

            }
            else
            {

                let res = yield _this.instance.get(url, {
                    params: {

                    }
                });



                return res.data;


            }


        }

    }

    post(url, opts){
        return co(this._post, this, url, opts)
    }

    *_post(_this, url, opts)
    {
        let data = (opts && opts.data) ? opts.data : {};

        //console.log(data)

        let res = yield _this.instance.post(url,{
            //data: data
        });

        return res.data;

    }

}

class Stash{

    constructor(web_client)
    {
        this.web_client = web_client;
        web_client.instance.defaults.baseURL = web_client.settings.stash_url;
    }

    projects()
    {
        return this.web_client.get("projects", true);
    }

    project_view(project_key)
    {
        return this.web_client.get("projects/" + project_key, false)
    }

    repositories(project_key)
    {
        return this.web_client.get("projects/" + project_key + "/repos", true)
    }

    branches(project_key, slug)
    {
        return this.web_client.get("projects/" + project_key + "/repos/" + slug + "/branches", true)
    }
}

class Bamboo{

    constructor(web_client)
    {
        this.web_client = web_client;
        web_client.instance.defaults.baseURL = web_client.settings.bamboo_url;
    }

    projects()
    {
        return this.web_client.get("project", true, {
            bamboo: true
        });
    }

    plans(project_key)
    {
        return this.web_client.get("project/" + project_key + "?expand=plans", true, {
            bamboo: true
        });
    }

    branches(plan_key)
    {
        return this.web_client.get("plan/" + plan_key + "/branch", true, {
            bamboo: true
        });
    }

    build(branch_key)
    {
        return this.web_client.post("queue/" + branch_key, {
            bamboo: true,
            data: {
                //executeAllStages: true
            }
        });
    }
    
    build_status(branch_key, build_number)
    {
        return this.web_client.get("result/" + branch_key + "-" + build_number, false, {
            bamboo: true
        });
    }

}





class Atlassian {

    constructor(username, password, _url){
        this.api_path = "rest/api/latest/";




        var config = {
            username: username,
            password: password,
            base_url: _url,
            default_url: url.resolve(_url, this.api_path),
        };
        config.bamboo_url = url.resolve(config.base_url, "/bamboo/");
        config.bamboo_url = url.resolve(config.bamboo_url, this.api_path);
        config.stash_url = url.resolve(config.base_url, "/stash/");
        config.stash_url = url.resolve(config.stash_url, this.api_path);
        config.crowd_url = url.resolve(config.base_url, "/crowd/");
        config.crowd_url = url.resolve(config.crowd_url, this.api_path);
        config.jira_url = url.resolve(config.base_url, "/jira/");
        config.jira_url = url.resolve(config.jira_url, this.api_path);



        this.Bamboo = new Bamboo(new WebClient(config));
        this.Stash = new Stash(new WebClient(config));
        //this.Jira = "";
        //this.Crowd = "";

        var that = this;

        /*
         co(function*(){
         let projects = yield that.Stash.projects();
         let project_view = yield that.Stash.project_view(projects[3].key)
         let repositories = yield that.Stash.repositories(project_view.key)
         let branches = yield that.Stash.branches(project_view.key, repositories[25].slug)
         }).catch(function(err){
         console.log(err)
         });*/

        co(function*(){
            /*let projects = yield that.Bamboo.projects();
            let plans = yield that.Bamboo.plans("DAT20142015");
            let branches = yield that.Bamboo.branches("DAT20142015-HAN");
            console.log(projects.length);
            console.log(plans.length);
            console.log(branches.length);*/

            let build = yield that.Bamboo.build("DAT20142015-HAN216");

            console.log(build.buildNumber)
            let build_status =  yield that.Bamboo.build_status(build.planKey, build.buildNumber)

            console.log(build_status);
        }).catch(function(err){
            console.log(err)
        });


        setInterval(function(){

        }, 1000)
    }


    help(){

    }

}



module.exports = Atlassian;