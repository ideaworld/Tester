let config = require('../config');
let models = require('../models');
let taskAction = require('./taskAction');
let Resource = models.Resource;
let ResourceDao = models.ResourceDao;
let Level = models.Level;
let LevelDao = models.LevelDao;
let FHIRServer = models.FHIRServer;
let FHIRServerDao = models.FHIRServerDao;
let Task = models.Task;
let TaskDao = models.TaskDao;
let Step = models.Step;
let StepDao = models.StepDao;

var test_type = config.task;

var get_value = function(step){
    if (step.description.toLowerCase() == 'success'){
        return 0; 
    }
    return 1;
}

var find_resource = function(name, target){
    for (var i = 0; i < target.length; i++) {
        if (target[i]['name'] == name) {
            return i;
        }
    }
    return -1;
}

var get_resources = function(){
    let resource_list = ResourceDao.find({});
    var resources = [];
    resource_list.forEach(resource_obj => {
        resource_list.push({'name': resource_obj.name})        
    });
    return resources;
}

var get_levels = function(){
    let level_list = levelDao.find({});
    var levels = [];
    level_list.forEach(level_obj => {
        levels.push({'name': level_obj.name})        
    });
    return levels;
}

var form_matrix = function(ttype,ttime){
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    if (ttype == test_type['FHIR_TEST']){
        datas['resources'] = get_resources();
    }
    else if (ttype == test_type['STANDARD_TEST']) {
        datas['resources'] = get_levels()
    }
    else{
        return datas;
    }
    var datetime_obj = undefined;
    if (ttime && ttime.length > 0){
        datetime_obj = ttime.toUTCString();
    }
    let server_list = FHIRServerDao.find({
        is_deleted:false,
    }); 
    var server_index = 0;
    server_list.forEach(obj => {
        datas['servers'].push({'name':obj.server_name});
        var task_id = undefined;
        if (datetime_obj){
            let task_list = Task.find({
                task_type:ttype,
                target_server:server_obj,
                create_time:datetime_obj
            })
            if (task_list.length != 0){
                task_id = task_list[0];
            }
            else{
                server_index += 1;
                return true;
            }
        }
        else{
            let task_list = TaskDao.find({
                task_type:ttype,
                target_server:server_obj
            });
            if (task_list.length != 0){
                task_id = task_list[0];
            }
            else{
                server_index += 1;
                return true;
            }
        }
        if (task_id){
            let task_step_list = StepDao.find({
                task_id:task_id
            });
            task_step_list.forEach(task_step_obj => {
                if (task_step_obj.name == undefined || task_step_obj.name.length == 0){
                    return true;
                }
                var source = server_index;
                var target = find_resource(task_step_obj.name,datas['resources'])
                if (target == -1){
                    return true;
                }
                datas['links'].push({
                    'source':source,
                    'target':target,
                    'value': get_value(task_step_obj)
                })
            });
        }
        server_index += 1;
    });
    return datas;
}

var rmatrixAction = function(rmat){
    var rmatrix = {
        'links':[],
        'resources':[],
        'servers':[]
    }
    let resource_list = ResourceDao.find({});
    resource_list.forEach(obj => {
        rmatrix['resources'].push({'name':obj.name});
    });
    let server_list = FHIRServerDao.find({
        is_delete:false
    });
    var server_index = 0;
    server_list.forEach(obj => {
        rmatrix['servers'].push({'name':obj.name});
        let task_list = TaskDao.find({
            task_type:3,
            target_server:server_obj
        });   
        var task_id = undefined;
        if (task_list.length != 0) {
            task_id = task_list[0];
        }
        else {
            server_index += 1;
            return true;
        }
        if (task_id != undefined) {
            let task_step_list = StepDao.find({
                task_id:task_id
            });
            task_step_list.forEach(obj => {
                if (obj.name == undefined || obj.name.length == 0) {
                    return true;
                }
                var source = server_index;
                var target = find_resource(obj.name, rmatrix['resource']);
                if (target == -1) {
                    return true;
                }
                rmatrix['links'].push({
                    'source':source,
                    'target':target,
                    'value': get_value(obj)
                });
            });
        }
        server_index += 1;
    });
    return rmatrix;
}

var ttimeAction = function(tt){
    var ttimes = {
        'isSuccessful':true,
        'times':[]
    }
    var ttype = tt['ttype'];
    try{
        let time_list = TaskDao.find({
            task_type:ttype
        });
        console.log(time_list);
        time_list.forEach(t => {
            ttimes.times.push(t.create_time.toUTCString());
        });
    }catch( err ){
        console.log(err);
        ttimes.isSuccessful = false;
    }
    
    return ttimes;
}

var form_matrix = function(version_id, task_type_id, task_time){
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    console.log(task_type_id)
    // get task type, resources and servers
    var task_type_obj = taskAction.get_task_type_obj(task_type_id);
    var version_obj = taskAction.get_version_obj(version_id);
    if ( !task_type_obj ){
        console.log('task object missing')
        return datas;
    }
    if( !version_obj ){
        console.log('version object missing')
        return datas;
    }
    var resource_dict = {};
    var task_type_info = task_type_obj.toObject({
            recursive: true
        });
    console.log(task_type_info);
    task_type_info.related_resources.map( resource => {
        console.log(resource.name, resource.version.number, version_obj.number)
        if( resource.version.number == version_obj.number ){
            var resource_key = resource.name
            if( resource.name.length == 1 ){
                resource_key = "Level " + resource.name
            }
            var new_index = datas.resources.push({name:resource_key}) -1;
            console.log(resource_key);
            resource_dict[resource_key] = new_index;
        }
    });
    console.log(resource_dict);
    var server_dict = {};
    var servers = FHIRServerDao.find({});
    servers.map( server => {
        var new_index = datas.servers.push({name:server.name}) - 1;
        server_dict[server.name] = new_index;
    });
    console.log(server_dict);
    //get tasks
    var task_list = null;
    if( task_time && task_time.length > 0 ){
        task_list = TaskDao.find({
            task_type:task_type_obj,
            fhir_version: version_obj,
            code_status: {$in: ["F", "S"]},
            create_time: new Date(task_time)
        });
    }else{
        task_list = TaskDao.find({
            task_type:task_type_obj,
            fhir_version: version_obj,
            code_status: {$in: ["F", "S"]},
        });
    }
    if( task_list ){
        task_info_list = Task.toObjectArray(task_list, {recursive:true});
        task_info_list.map(task_obj => {
            console.log(task_obj.fhir_version.number, task_obj.task_type.name);
            var server_index = server_dict[task_obj.target_server.name];
            task_obj.steps.map(step_obj => {
                var resource_index = resource_dict[step_obj.name];
                if( server_index != undefined && resource_index != undefined){
                    console.log({
                        "source":server_index,
                        "target": resource_index,
                        "value": step_obj.code_status === "S" ? 1 : 0
                    });
                    datas.links.push({
                        "source":server_index,
                        "target": resource_index,
                        "value": step_obj.code_status === "S" ? 1 : 0
                    });
                }
            });
        });
    }
    return datas;
}

// var cmatrixAction = function(cmat){
//     var ttype = String(cmat.ttype)
//     var cmatrix = {
//         'isSuccessful':true,
//         'matrix':{}
//     }
//     var ttime = "";
//     if (cmat['time'] != undefined){
//         ttime = cmat['time'];
//     }
//     console.log(ttime,ttype);
//     cmatrix['matrix'] = form_matrix(ttype, ttime)
//     return cmatrix;
// }

module.exports = {
    rmatrixAction,
    ttimeAction,
    form_matrix
}