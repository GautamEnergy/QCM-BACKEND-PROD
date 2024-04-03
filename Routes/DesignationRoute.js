const express = require('express')
const designationRouter = express.Router()

const {getDesignationList,getDepartmentList,getWorkLocationList} = require('../Controller/DesignationController.js')





/** To get Designation List */
designationRouter.get('/GetDesignationList',getDesignationList)

/** To Get Department List */
designationRouter.get('/GetDepartmentList',getDepartmentList)

/** To Get Work Location */
designationRouter.get('/GetWorkLocationList',getWorkLocationList)



/** export */
module.exports = {designationRouter}