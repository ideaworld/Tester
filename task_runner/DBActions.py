from .models import *

def get_task_object(task_id):
    try:
        task_obj = Task.objects.get(id=task_id)
        return task_obj
    except:
        return None