(function(){

    function humaneDate(date, compareTo){

        if(!date) {
            return;
        }

        var lang = {
                ago: 'Ago',
                from: '',
                now: 'Just Now',
                minute: 'Minute',
                minutes: 'Minutes',
                hour: 'Hour',
                hours: 'Hours',
                day: 'Day',
                days: 'Days',
                week: 'Week',
                weeks: 'Weeks',
                month: 'Month',
                months: 'Months',
                year: 'Year',
                years: 'Years'
            },
            formats = [
                [60, lang.now],
                [3600, lang.minute, lang.minutes, 60], // 60 minutes, 1 minute
                [86400, lang.hour, lang.hours, 3600], // 24 hours, 1 hour
                [604800, lang.day, lang.days, 86400], // 7 days, 1 day
                [2628000, lang.week, lang.weeks, 604800], // ~1 month, 1 week
                [31536000, lang.month, lang.months, 2628000], // 1 year, ~1 month
                [Infinity, lang.year, lang.years, 31536000] // Infinity, 1 year
            ],
            isString = typeof date == 'string',
            date = isString ?
                new Date(('' + date).replace(/-/g,"/").replace(/[TZ]/g," ")) :
                date,
            compareTo = compareTo || new Date,
            seconds = (compareTo - date +
                (compareTo.getTimezoneOffset() -
                    // if we received a GMT time from a string, doesn't include time zone bias
                    // if we got a date object, the time zone is built in, we need to remove it.
                    (isString ? 0 : date.getTimezoneOffset())
                    ) * 60000
                ) / 1000,
            token;

        if(seconds < 0) {
            seconds = Math.abs(seconds);
            token = lang.from ? ' ' + lang.from : '';
        } else {
            token = lang.ago ? ' ' + lang.ago : '';
        }

        /*
         * 0 seconds && < 60 seconds        Now
         * 60 seconds                       1 Minute
         * > 60 seconds && < 60 minutes     X Minutes
         * 60 minutes                       1 Hour
         * > 60 minutes && < 24 hours       X Hours
         * 24 hours                         1 Day
         * > 24 hours && < 7 days           X Days
         * 7 days                           1 Week
         * > 7 days && < ~ 1 Month          X Weeks
         * ~ 1 Month                        1 Month
         * > ~ 1 Month && < 1 Year          X Months
         * 1 Year                           1 Year
         * > 1 Year                         X Years
         *
         * Single units are +10%. 1 Year shows first at 1 Year + 10%
         */

        function normalize(val, single)
        {
            var margin = 0.1;
            if(val >= single && val <= single * (1+margin)) {
                return single;
            }
            return val;
        }

        for(var i = 0, format = formats[0]; formats[i]; format = formats[++i]) {
            if(seconds < format[0]) {
                if(i === 0) {
                    // Now
                    return format[1];
                }

                var val = Math.ceil(normalize(seconds, format[3]) / (format[3]));
                return val +
                    ' ' +
                    (val != 1 ? format[2] : format[1]) +
                    (i > 0 ? token : '');
            }
        }
    }

    // Prettify the dates
    if(typeof context.resources.photos != 'undefined' && context.resources.photos.data.length > 0){
        context.resources.photos.data.forEach(function(ele, index){
            context.resources.photos.data[index].updated_time = humaneDate(context.resources.photos.data[index].updated_time);
        });
    }
    if(typeof context.resources.albums != 'undefined' &&  context.resources.albums.data.length > 0){
        context.resources.albums.data.forEach(function(ele, index){
            context.resources.albums.data[index].updated_time = humaneDate(context.resources.albums.data[index].updated_time);
        });
    }



})();