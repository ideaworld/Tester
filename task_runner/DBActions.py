from .models import *
import traceback

def get_unprocessed_task():
    try:
        unprocessed_tasks = Task.objects(is_processed=False)
        return unprocessed_tasks
    except:
        traceback.print_exc()
        return None

def insert_task():
    new_task = Task(task_parameters="")
    new_task.save()

def push_level2result(result_id, level_obj):
    update_info = {
        "push__level": level_obj
    }
    return update_a_result(result_id, update_info)

def push_result2task(task_id, result_obj):
    update_info = {
        "result": result_obj
    }
    return update_a_task(task_id, update_info)

def push_step2task(task_id, step_obj):
    update_info = {
        "push__steps": step_obj
    }
    return update_a_task(task_id, update_info)

def push_case2step(step_id, case_obj):
    update_info = {
        "push__cases": case_obj
    }
    return update_a_step(step_id, update_info)

def update_task_status(task_id, new_status):
    update_info = {
        "code_status":new_status
    }
    return update_a_task(task_id, update_info)

def update_step_status(step_id, new_status):
    update_info = {
        "code_status":new_status
    }
    return update_a_step(step_id, update_info)


# CURDs
# CURD for Case
def create_a_case(case_info):
    new_case = Case(**case_info)
    try:
        new_case.save()
        return new_case
    except:
        traceback.print_exc()
        return None

def get_case(case_id):
    try:
        caes_obj = Case.objects(id=case_id)
        return caes_obj[0]
    except:
        traceback.print_exc()
        return None

def find_case(find_query):
    try:
        found_cases = Case.objects(**find_query)
        return found_cases
    except:
        traceback.print_exc()
        return None

def update_a_case(case_id, update_info):
    try:
        Case.objects(id=case_id).update_one(**update_info)
        return True
    except:
        traceback.print_exc()
        return False

#CURD for Step
def create_a_step(step_info):
    new_step = Step(**step_info)
    try:
        new_step.save()
        return new_step
    except:
        traceback.print_exc()
        return None

def get_step(step_id):
    try:
        step_obj = Step.objects(id=step_id).first()
        return step_obj
    except:
        traceback.print_exc()
        return None

def find_step(find_query):
    try:
        found_steps = Step.objects(**find_query)
        return found_steps
    except:
        traceback.print_exc()
        return None

def update_a_step(step_id, update_info):
    try:
        Step.objects(id=step_id).update_one(**update_info)
        return True
    except:
        traceback.print_exc()
        return False

#CURD for Result
def create_a_result(result_info):
    new_result = Result(**result_info)
    try:
        new_result.save()
        return new_result
    except:
        traceback.print_exc()
        return None

def update_a_result(result_id, update_info):
    try:
        Result.objects(id=result_id).update_one(**update_info)
        return True
    except:
        traceback.print_exc()
        return False

# CURD for Task
def update_a_task(task_id, update_info):
    try:
        Task.objects(id=task_id).update_one(**update_info)
        return True
    except:
        traceback.print_exc()
        return False

def get_task(task_id):
    try:
        task_obj = Task.objects(id=task_id).first()
        return task_obj
    except:
        traceback.print_exc()
        return None

# CURD for Server
def get_server(server_id):
    try:
        server_obj = FHIRServer.objects(id=server_id).first()
        return server_obj
    except:
        traceback.print_exc()
        return None

# CURD for Resource
def get_resource_wit_name(resource_name, type_code):
    try:
        resource_obj = Resource.objects(name=resource_name, type_code=type_code).first()
        return resource_obj
    except:
        traceback.print_exc()
        return None

