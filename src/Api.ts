import React from "react";
import axios from 'axios';
import { Expense } from "./Expense";
import { Category } from "./Category";
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1/Finance'
});


export const createNewCategory = async(name: string, color: string) =>{
  try{
    const sanitizedColor = color.replace('#', '');  
    const Api_Response = await api.post(`/create/Category/${name}/${sanitizedColor}`)
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const deleteCategory = async(id : number) =>{
  try{
    const Api_Response = await api.delete(`/delete/Category/${id}`)
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const addExpensesToCategory = async(id : number, expense : {name: string, ausgabe: number, ausgabeDatum: Date}) =>{
  try{
    const Api_Response = await api.post(`/add/Expense/to/Category/${id}`,expense);
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const deleteExpenseFromCategory = async(CategoryId: number, ExpenseId: number) =>{
  try{
    const Api_Response = await api.delete(`/delete/Expense/from/Category/${CategoryId}/${ExpenseId}`);
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getCategories = async() =>{
  try{
    const Api_Response = await api.get("/get/Categories");
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getExpensesFromCategory = async(id: number) =>{
  try{
    const Api_Response = await api.get(`/get/Expenses/from/Category/${id}`)
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getDailyAusgabe = async()=>{
    try{
      const Api_Response = await api.get("/get/daily/ausgaben")
      return Api_Response.data;
    }catch(error){
      console.log(error);
      throw error;
    }
}

export const getMonthlyAusgaben = async()=>{
  try{
    const Api_Response = await api.get("/get/monthly/ausgaben")
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const findByExpensesName = async(name: string)=>{
  try{
    if(name.length > 0){
    const Api_Response = await api.get(`/find/by/${name}`)
    return Api_Response.data;
    }else{
      const Api_Response = await api.get("/find/by/+")
      return Api_Response.data;
    }
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const checkIfExpensesAreOverLimit = async() =>{
  try{
    const Api_Response = await api.get(`/check/if/over/the/Limit`)
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const SetLimit = async(limit : number) =>{
  try{
    const Api_Response = await api.post(`set/Limit/${limit}`);
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  } 
}

export const getLimit = async()=>{
  try{
    const Api_Response = await api.get("/get/Limit")
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getAiResponseOnHowToSaveMoreInCategory = async(id : number) =>{
  try{
    const Api_Response = await api.get(`/ask/ai/how/to/save/more/in/category/${id}`)
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}

export const getAiResponseOnHowToSaveMoreInGeneral = async()=>{
  try{
    const Api_Response = await api.get("/ask/ai/how/to/save/money/in/general");
    return Api_Response.data;
  }catch(error){
    console.log(error);
    throw error;
  }
}