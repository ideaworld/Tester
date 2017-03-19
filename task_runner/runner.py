from .test_tasks import *
from .tasks import *
from .DBActions import get_task_object
import json

class Runner:
    def __init__(self, pool_size=-1):
        self.pendding_tasks = []
        self.processing_tasks = []
        self.pool_size = pool_size # size of running pool, -1 as infinite

    def __is_pool_full(self):
        return self.pool_size != -1 and len(self.processing_tasks) - self.pool_size <= 0

    def __excute_next_task(self):
        '''
        excute a new task from the pool
        '''
        if len(self.pendding_tasks) > 0:
            next_task_id = self.pendding_tasks.pop(0)
            next_task_obj = self.__create_new_task_obj(next_task_id)
            if next_task_obj is not None:
                self.processing_tasks.append({
                    'task_id' : next_task_id,
                    'task_obj': next_task_obj
                })
                excute_task.delay(next_task_obj)
    
    def __find_task_in_pool(self, task_id):
        '''
        find a task in pool with task_id, return index of task, -1 if not found
        '''
        for index, task_item in enumerate(self.processing_tasks):
            if task_item['task_id'] == task_id:
                return index
        return -1

    def notify_completed(self, task_id):
        '''
        called when a task is done and remove from pool
        '''
        task_index = self.__find_task_in_pool(task_id)
        if task_index >= 0:
            del self.processing_tasks[task_index]
            if len(self.pendding_tasks) > 0:
                self.__excute_next_task()

    def __get_task_configs(self, task_id):
        '''
        get task config (parameters and task class)
        '''
        task_instance = get_task_object(task_id)
        if task_instance is None:
            return None
        task_config = {

            'parameters': task_instance.task_parameters,
            'task_class': task_instance.task_type.task_class
        }
        return task_config

    def __create_new_task_obj(self, task_id):
        '''
        create a new task instance
        '''
        task_config = self.__get_task_configs(task_id)
        if task_config is None:
            return None
        task_clas_name = task_config['task_class']
        new_task_obj = None
        try:
            new_task_class = globals()[task_clas_name]
            parameters = json.loads(task_config['parameters'])
            new_task_obj = new_task_class(parameters)
        except:
            pass
        return new_task_obj

    def append_new_task(self, task_id):
        '''
        add a new task to pool
        '''
        self.pendding_tasks.append(task_id)
        if not self.__is_pool_full():
            self.__excute_next_task()

