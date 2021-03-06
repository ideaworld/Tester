# -*- coding: utf-8 -*-
import sys
from .WrapperClasses import *

class Generator():

    __TestList__ = TestCaseClass()
    __loadready__ = False
    __versionType__ = None
    __resourceName__ = None
    __resourceType__ = None

    #修改了 load_definition 的方式，作为传入 版本与resourceName
    def load_definition(self,version,resourceName):
        parameters = []
        parameters.append(version)
        parameters.append(resourceName)
        if self.__TestList__.ReturnClassByDataBaseName('MongoDB',parameters,'selectForCount'):
            self.__versionType__ = version
            self.__resourceName__ = resourceName
            self.__loadready__ = True
            return True
        else:
            self.__loadready__ = False
            self.__versionType__ = None
            self.__resourceName__ = None
            return False

    def resouce_type(self):
        return self.__resourceType__

    #获取到正确cases的list
    def correct_cases(self,hint):
        if self.__loadready__:
            parameters = []
            parameters.append(self.__versionType__)
            parameters.append(self.__resourceName__)
            parameters.append('1')
            parameters.append(hint)
            list = self.__TestList__.ReturnClassByDataBaseName('MongoDB',parameters,'selectForList')
            return list
        return None

    #获取到错误cases的list
    def wrong_cases(self):
        if self.__loadready__:
            parameters = []
            parameters.append(self.__versionType__)
            parameters.append(self.__resourceName__)
            parameters.append('0')
            list = self.__TestList__.ReturnClassByDataBaseName('MongoDB', parameters, 'selectForList')
            return list
        return None

    # 通过传入特定的网页来获取参数
    # def __getElement__(self,spec_url):
    #     url = spec_url
    #     try:
    #         req = urllib2.urlopen(url)
    #         soup = BeautifulSoup(req,'html.parser')
    #         title = soup.find('title').text.replace(' ','')
    #         try:
    #             list = title.split('-FHIRv')
    #         except Exception,e:
    #             print e
    #             return False
    #         self.__resourceName__ = list[0].encode('utf-8')
    #         self.__versionType__ = list[1].encode('utf-8')
    #         self.__loadready__ = True
    #         return True
    #     except Exception,e:
    #         print e
    #     return False
