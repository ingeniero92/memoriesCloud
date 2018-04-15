import React from 'react'

import _ from 'lodash'

export const replaceHttps = url => {
    return _.replace(url, /^http:\/\//i, 'https://')
}

export const removeHtmlTags = text => {
    return _.replace(text, /<[^>]*>/g, "")
}

export const getYear = date => {
    const newDate = new Date(date)
    return newDate.getFullYear()
}

export const getCurrentDate = () => {
    
    var date = new Date().getUTCDate().toString();
    var month = (new Date().getUTCMonth() + 1).toString();
    var year = new Date().getUTCFullYear().toString();
    var hour = new Date().getUTCHours().toString();
    var minute = new Date().getUTCMinutes().toString();
    var second = new Date().getUTCSeconds().toString();

    if(date.length == 1){
        date = '0' + date;
    }

    if(month.length == 1){
        month = '0' + month;
    }

    if(hour.length == 1){
        hour = '0' + hour;
    }

    if(minute.length == 1){
        minute = '0' + minute;
    }

    if(second.length == 1){
        second = '0' + second;
    }

    fullDate = year + month + date + hour + minute + second

    return fullDate

}

export const getCurrentMilliseconds = () => {
    var milliseconds = new Date().getUTCMilliseconds().toString();
    return milliseconds
}

function convertDateToMilliseconds(date){

    var year = Number(date.substring(0, 4))
    var month = Number(date.substring(4, 6)) - 1
    var day = Number(date.substring(6, 8))
    var hours = Number(date.substring(8, 10))
    var minutes = Number(date.substring(10, 12))
    var seconds = Number(date.substring(12, 14))
    var milliseconds = 0

    var dateMilliseconds = new Date(year, month, day, hours, minutes, seconds, milliseconds)

    return dateMilliseconds.getTime()

}

function compareMemories(a,b){

    const dateA = Number(a.date)
    const dateB = Number(b.date)

    let comparison = 0

    if (dateA > dateB) {
        comparison = 1
    } else if (dateA < dateB) {
        comparison = -1
    }
    return comparison * -1
}

export const getArrayFromObject = (object) => {
    const objectArray = Object.keys(object).map(key => 
        item = {key: key, date: object[key].date, text: object[key].text, title: object[key].title}
    )
    return objectArray
}

export const getSortedMemoriesFromObject = (object) => {  
    
    if(object){
        var memoriesObject = getArrayFromObject(object)
        var sortedMemories = memoriesObject.sort(compareMemories)
        return memoriesObject
    } else {
        return object
    }   
    
}

export function compareDates(date){
    
    var currentDateMilliseconds = new Date().getTime()
    var dateMilliseconds = convertDateToMilliseconds(date)
    var dif = (Math.abs(currentDateMilliseconds - dateMilliseconds))/(1000*60*60*24)
    var difString

    if(dif > 0){
        difString = "Today"
    }

    if(dif > 1){
        difString = "Yesterday"
    }

    if(dif > 2){
        difString = "+2 days ago"
    }

    if(dif > 3){
        difString = "+3 days ago"
    }

    if(dif > 4){
        difString = "+4 days ago"
    }

    if(dif > 5){
        difString = "+5 days ago"
    }

    if(dif > 6){
        difString = "+6 days ago"
    }

    if(dif > 7){
        difString = "+1 week ago"
    }

    if(dif > 14){
        difString = "+2 weeks ago"
    }

    if(dif > 21){
        difString = "+3 weeks ago"
    }

    if(dif > 30){
        difString = "+1 month ago"
    }

    if(dif > 60){
        difString = "+2 months ago"
    }

    if(dif > 90){
        difString = "+3 months ago"
    }

    if(dif > 120){
        difString = "+4 months ago"
    }

    if(dif > 150){
        difString = "+5 months ago"
    }

    if(dif > 180){
        difString = "+6 months ago"
    }

    if(dif > 210){
        difString = "+7 months ago"
    }

    if(dif > 240){
        difString = "+8 months ago"
    }

    if(dif > 270){
        difString = "+9 months ago"
    }

    if(dif > 300){
        difString = "+10 months ago"
    }

    if(dif > 330){
        difString = "+11 months ago"
    }

    if(dif > 365){
        difString = "+1 year ago"
    }

    if(dif > 730){
        difString = "+2 years ago"
    }

    if(dif > 1095){
        difString = "+3 years ago"
    }

    return difString

}