from django.http import HttpResponse, JsonResponse
from django.template import loader
import json
from django.shortcuts import render

class InputValidation:
    
    def getParams(self, request):
        try:
            paramObj = {
                "jsOptionId": self.valid_str_format(request.GET['jsOptionId']),
                "moveCount": self.valid_int(request.GET['moveCount']),
                "openCells": self.valid_list_format(request.GET.getlist('openCells[]')),
                "potentialChoices": self.valid_list_format(request.GET.getlist('potentialChoices[]')),
                "urgentChoices": self.valid_list_format2(request.GET.getlist('urgentChoices[]')),
                "opponentCells": self.valid_list_format(request.GET.getlist('opponentCells[]')),
                "computerCells": self.valid_list_format(request.GET.getlist('computerCells[]')),
                "orderedChoices": self.valid_list_format3(request.GET.getlist('orderedChoices[]'))
            }
            
            return paramObj
        except:
            raise
        
    def valid_winner(self, value):
        try:
            if (False == isinstance(int(value), int) and (1 != value and 2 != value)):
                raise ValueError("incorrect format (1)")
            
            return value
        except ValueError as error:
            raise error
        
    def valid_int(self, value):
        try:
            if (False == isinstance(int(value), int)):
                raise ValueError("incorrect format (2)")
            
            return value
        except ValueError as error:
            raise error
    
    def valid_cell_format(self, val):
        try:
            arr = list(str(val))
            if 4 != len(arr):
                raise ValueError("incorrect format (3)")
            elif 'r' != arr[0] and 'c' != arr[2]:
                 raise ValueError("incorrect format (4)")
            elif False == isinstance(int(arr[1]), int) and False == isinstance(int(arr[3]), int):
                 raise ValueError("incorrect format (5)")
                
            return val    
        except ValueError as error:
            raise error
    
    def valid_list_format(self, array):
        try:
            if (False == isinstance(array, list)):
                raise ValueError("incorrect format (6)")
            
            for val in array: 
                self.valid_cell_format(val)
                
            return array
        except ValueError as error:
            raise error
        
    def valid_list_format2(self, array):
        try:
            if (False == isinstance(array, list)):
                raise ValueError("incorrect format (7)")
            
            for val in array: 
                arr = list(str(val))
                if 6 != len(arr):
                    raise ValueError("incorrect format (8)")
                elif 'r' != arr[2] and 'c' != arr[4]:
                     raise ValueError("incorrect format (9)")
                elif False == isinstance(int(arr[3]), int) and False == isinstance(int(arr[5]), int):
                     raise ValueError("incorrect format (10)")
                
            return array
        except ValueError as error:
            raise error
                
    def valid_list_format3(self, array):
        try:
            if (False == isinstance(array, list)):
                raise ValueError("incorrect format (11)")
            
            for val in array: 
                arr = list(str(val))
                if (8 != len(arr) and 9 != len(arr)):
                    raise ValueError("incorrect format (12)")
                elif (('r' != arr[4] and 'r' != arr[5]) and ('c' != arr[6] and 'c' != arr[7])):
                     raise ValueError("incorrect format (13)")
                elif (False == isinstance(int(arr[0]), int) and False == isinstance(int(arr[1]), int)):
                     raise ValueError("incorrect format (14)")
                
            return array
        except ValueError as error:
            raise error
                
    def valid_str_format(self, value):
        try:
            arr = list(str(value))
            if 4 != len(arr):
                raise ValueError("incorrect format (15)")
            elif 'r' != arr[0] and 'c' != arr[2]:
                 raise ValueError("incorrect format (16)")
            elif False == isinstance(int(arr[1]), int) and False == isinstance(int(arr[3]), int):
                 raise ValueError("incorrect format (17)")
            else:
                return value
        except ValueError as error:
            raise error
            
            
            