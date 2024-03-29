from django.urls import path
from teacher.views import *

urlpatterns = [
    path('get_teachers/', get_all_teachers, name='get_teachers'),
    path('remove_user/<int:teacher_id>', remove_user, name='remove_user'),
    path('add_teacher_school/', create_school, name='create_school'),
    path('add_teacher/', add_teacher, name='add_teacher'),
    path('get_all_schools/<str:user_id>', get_all_schools, name='get_all_schools'),
    path('add_course/', add_course, name='add_course'),
    path('get_courses/<str:user_id>', get_courses, name='get_courses'),
    path('add_section/', add_section, name='add_section'),
    path('get_all_sections/<int:courseID>', get_sections, name='get_sections'),
    path('remove_school/<int:school_id>', delete_school, name='delete_school'),
    path('update_school/<int:school_id>', update_school, name='update_school'),
    path('get_teacher_creds/<int:user_id>', get_teacher_creds, name='get_teacher_creds'),
    path('update_teacher/', update_teacher, name='update_teacher'),
    path('delete_course/<int:course_id>', delete_course, name='delete_course'),
    path('get_all_teacher_courses/<str:user_id>', get_all_teacher_courses, name='get_all_teacher_courses/'),
    path('get_all_sections/<str:user_id>', get_all_sections,name='get_all_sections'),
    path('remove_section/<int:section_id>', delete_section, name='delete_section'),
    path('get_fees/<str:user_id>', get_fees, name='get_fees'),
    path('add_fees/<str:user_id>', add_fees, name='add_fees'),
    path('delete_fees/<int:fee_id>', delete_fees, name='delete_fees'),
    path('add_lecture/<str:user_id>', add_lecture, name='add_lecture'),
    path('get_all_lectures/<str:user_id>', get_all_lectures, name='get_all_lectures'),
    path('delete_lecture/<int:lecture_id>', delete_lecture, name='delete_lecture'),
]

