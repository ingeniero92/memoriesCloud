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
        second = '0' +second;
    }

    fullDate = year + month + date + hour + minute + second

    return fullDate

}

export const getCurrentMilliseconds = () => {
    var milliseconds = new Date().getUTCMilliseconds().toString();
    return milliseconds
}