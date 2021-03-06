let config = require('../config')

let um = require('unique-model');
let Types = um.Types;
let Text = Types.Text;
let Integer = Types.Integer;
let Double = Types.Double;
let Bool = Types.Bool;
let DateTime = Types.DateTime;
let UObject = Types.UObject;
let UObjectArray = Types.UObjectArray;

um.enablePersist();
let session = um.createSession(config.database);

let User = um.model.createModel('User', {
    username: Text(),
    password: Text(),
    user_level: Integer(),
});

let ServerAuthScope = um.model.createModel('ServerAuthScope', {
    name: Text()
})

let ServerAuthInfo = um.model.createModel('ServerAuthInfo', {
    client_id: Text(),
    redirect_uri: Text(),
    scopes: UObjectArray({
        type: 'ServerAuthScope'
    }),
    auth_url: Text()
});

let Scope = um.model.createModel('Scope', {
    role:Text(),
    resource: Text(),
    operation: Text()
});

let App = um.model.createModel('App', {
    name: Text(),
    author: UObject({
        type: 'User'
    }),
    client_id:Text(),
    launch_uri: Text(),
    redirect_uri: Text(),
    logo_file: Text(),
    is_stand_alone: Bool(),
    is_patient_required: Bool(),
    scopes:UObjectArray({
        type:'Scope'
    })  
});

let FHIRServer = um.model.createModel('FHIRServer', {
    name: Text(),
    url: Text(),
    access_token: Text(),
    is_deleted: Bool(),
    is_deletable: Bool(),
    is_auth_required: Bool(),
    auth_info : UObject({
        type: 'ServerAuthInfo'
    })
});

let Level = um.model.createModel('Level', {
    name: Text()
});

let Resource = um.model.createModel('Resource', {
    name: Text(),
    type_code: Integer(),
    isOptionable: Bool(),
    version: UObject({
        type: "FHIRVersion"
    })
});

let Case = um.model.createModel('Case', {
    code_status: Text(),
    name: Text(),
    description: Text(),
    http_request: Text(),
    http_response: Text(),
    http_response_status: Integer(),
    resource: Text()
});

let Step = um.model.createModel('Step', {
    name: Text(),
    code_status: Text(),
    description: Text(),
    additional_filepath: Text(),
    cases: UObjectArray({
        type: 'Case'
    })
});

let FHIRVersion = um.model.createModel('FHIRVersion' ,{
    name: Text(),
    number: Text(),
    url: Text(),
    index_url: Text()
})

let TaskType = um.model.createModel('TaskType', {
    name: Text(),
    task_class: Text(),
    related_resources: UObjectArray({
        type: 'Resource'
    })
});

let Task = um.model.createModel('Task', {
    target_server: UObject({
        type: 'FHIRServer'
    }),
    task_parameters: Text(),
    task_type: UObject({
        type: 'TaskType'
    }),
    fhir_version: UObject({
        type:"FHIRVersion"
    }),
    code_status: Text(),
    create_time : DateTime(),
    user: UObject({
        type: 'User'
    }),
    steps: UObjectArray({
        type: 'Step'
    }),
    is_processed:Bool(),
    result: UObject({
        type:"Result"
    })
});

let Result = um.model.createModel('Result', {
    code_status: Text(),
    level: UObjectArray({
        type: 'Resource'
    })
});

let UserDao = session.getDao(User);
let FHIRServerDao = session.getDao(FHIRServer);
let ResourceDao = session.getDao(Resource);
let LevelDao = session.getDao(Level);
let CaseDao = session.getDao(Case);
let StepDao = session.getDao(Step);
let TaskDao = session.getDao(Task);
let TaskTypeDao = session.getDao(TaskType);
let ResultDao = session.getDao(Result);
let ServerAuthInfoDao = session.getDao(ServerAuthInfo);
let ServerAuthScopeDao = session.getDao(ServerAuthScope);
let FHIRVersionDao = session.getDao(FHIRVersion);
let AppDao = session.getDao(App);
let ScopeDao = session.getDao(Scope);

module.exports = {
    App,
    User,
    FHIRServer,
    Resource,
    Level,
    Scope,
    Case,
    Step,
    Task,
    TaskType,
    Result,
    ServerAuthInfo,
    ServerAuthScope,
    AppDao,
    UserDao,
    FHIRServerDao,
    ResourceDao,
    LevelDao,
    ScopeDao,
    CaseDao,
    StepDao,
    TaskDao,
    TaskTypeDao,
    ResultDao,
    ServerAuthInfoDao,
    ServerAuthScopeDao,
    FHIRVersion,
    FHIRVersionDao
}