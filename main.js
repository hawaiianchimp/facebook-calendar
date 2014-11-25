function test(size){
	var events = [];
	for(var i=0; i<size;i++){

		var start = Math.floor((Math.random() * 720));
		var end = Math.floor((Math.random() * 720));
		if(start > end){
			var temp = end;
			end = start;
			start = temp;
		}
		events.push({
			start: start,
			end: end
		});
	}
	layOutDay(events);
	return events;
}

var cal_width = 600;
var cal_height = 720;
var cal_padding = 10;
var group_size = 0;


var events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
var events = [ {start: 274, end: 458}, {start: 30, end: 221}, {start: 203, end: 654} ];
var events = [ {start: 44, end: 179}, {start: 25, end: 351}, {start: 438, end: 510}, {start: 185, end: 705} ];
layOutDay(events);

function layOutDay(events) { 

	var cal = document.querySelector("#calendar");
	cal.style.width = cal_width + "px";
	cal.style.height = cal_height + "px";
	cal.style.padding = "0 " + cal_padding + "px";

	for(var e in events){
		events[e].group = 0;
		events[e].divide = 1;
	}
	Array.prototype.sort.call(events, function compare(event1,event2){
		return event1.start - event2.start;
	})

	var last_event = events[0];
	for(var e in events){

		var increase_divide;

		if(events[e].start < last_event.end)
		{
			increase_divide = last_event.divide;
		}
		else{
			increase_divide = 1;
		}

		for(var j = e; j<events.length;j++)
		{
			if(events[j] != events[e])
			{
				if((events[j].start >= events[e].start) && (events[j].start < events[e].end))
				{
					events[j].divide++;
					if(events[j].end > last_event.end){
						last_event = events[j];
					}
					if(events[j].group == events[e].group)
					{
						increase_divide++;
						events[j].group++;
					}
				}

				console.log(e,j);
				console.log(Array.prototype.map.call(events, function(i){return (i.group+","+i.divide);}));
			}
			createEvents(events)
		}
		if(increase_divide)
		{
			events[e].divide = increase_divide;
		}
	}

	// for(var k=0;k<events.length;k++){
	// 	events[k].group = 0;
	// 	events[k].divide = 1;
	// }
	//adjustEvent(events);
	// Array.prototype.reduce.call(events, function(event1, event2, index, array) {
	// 	return increaseColumn(event1, event2);
	// });
	// for(var e in events){
	// 	var overlaps = getStartOverlappingEvents(events[e], events)
	// 	console.log(overlaps);
	// 	for(var index in overlaps){
	// 		if(overlaps.length > events[overlaps[index]].divide){
	// 			events[overlaps[index]].divide = overlaps.length;
	// 			if (events[overlaps[index]].group == events[e].group){
	// 				events[overlaps[index]].group++;
	// 			}
	// 		}
	// 		console.log(events[overlaps[index]]);
	// 	}
	// }


	function adjustEvent(events, group_num){
		for(var e in events){
			if(events[e].group == group_num)
			{
				var overlaps = getOverlappingEvents(events[e], events);
				// for(var index in overlaps)
				// {
				// 	events[overlaps[index]].group++;
				// 	events[overlaps[index]].divide = overlaps.length;
				// }
				// var overlaps = getStartOverlappingEvents(events[e], events)
				console.log(overlaps);
				for(var index in overlaps){
						events[overlaps[index]].divide = overlaps.length;
					console.log(overlaps[index], e);
					if (events[overlaps[index]].group == events[e].group && overlaps[index] != e){
						events[overlaps[index]].group++;
					}
					console.log(events[overlaps[index]]);
				}
				adjustEvent(events, group_num +1);
			}
		}

	}
	//adjustEvent(events,0);

	// var g = 0;
	// while(g < group_size)

console.log(events);
console.log(events.length, createEvents(events));
}


function isOverlap(event1, event2){
	return (event1.start >= event2.start && event1.start < event2.end) || (event2.start >= event1.start && event2.start < event1.end);
}

function isStartOverlap(event1, event2){
	return (event1.group == event2.group) && (event1.start >= event2.start && event1.start < event2.end);
}

function increaseColumn(event1, event2){
	if(isOverlap(event1, event2)){
		event1.divide++;
		event2.divide++;
	}
	return [event1, event2];
}

function getOverlappingEvents(event, events){
	var arr = Array.prototype.map.call(events, function(e){
		return (isOverlap(event, e))? events.indexOf(e):null;
	});
	return Array.prototype.filter.call(arr, function(e){
		return e !== null;
	})
}

function getStartOverlappingEvents(event, events){
	var arr = Array.prototype.map.call(events, function(e){
		return (isStartOverlap(e, event))? events.indexOf(e):null;
	});
	return Array.prototype.filter.call(arr, function(e){
		return e !== null;
	})
}



function createEvent(event){
	if(event.start && event.end && (event.start < event.end)){
		var title = event.title || "Sample Item";
		var location = event.location || "Sample Location";
		
		var el = document.createElement("div");
		el.className = "event";

		var frame = document.createElement("div");
		frame.className = "event-info";
		
		var name_header = document.createElement("h2");
		name_header.className = "event-title";
		name_header.innerHTML = title;
		
		var location_header = document.createElement("h3");
		location_header.className = "event-location";
		location_header.innerHTML = location;
		
		frame.appendChild(name_header);
		frame.appendChild(location_header);
		el.style.top = (event.start) + "px";
		el.style.height = frame.style.height =(event.end - event.start) + "px";
		var width = (cal_width/event.divide)
		el.style.width = width + "px";
		el.style.left = (event.group*width + cal_padding) + "px";
		var cal = document.querySelector("#calendar");
		el.appendChild(frame);
		cal.appendChild(el);
		return 1;
	}
	return 0;
}

function createEvents(events){
	var count = 0;
	var cal = document.querySelector("#calendar");
	cal.innerHTML = "";
	//var width = (cal_width/group_size);
	for(event in events){
		count += createEvent(events[event]);
	}
	return count;
}	

// function adjustEvent(events){
// 	var clone = events;
// 	if(clone.length <= 1){
// 		return clone;
// 	}
// 	else
// 	{
// 		console.log(clone);
// 		var the_event = clone.pop();
// 		var new_events = [];
// 		new_events.push(the_event);
// 		for(var e in clone){
// 			if(the_event.start >= clone[e].start && the_event.start < clone[e].end){
// 				new_events.push(clone[e]);
// 				clone.splice(e, 1);
// 				console.log(new_events);
// 			}
// 		}
// 		console.log("createEvents("+new_events+", "+new_events.length+");")
// 		createEvents(new_events, new_events.length);
// 		return adjustEvent(clone);
// 	}
// }



// var i=0;
// function loop1(){
// 	setTimeout(function(){
// 		var j=0;
// 		function loop2(){
// 			setTimeout(function(){
// 				if((i !== j) && (events[i].group === events[j].group)){
// 					if(events[j].start >= events[i].start && events[j].start < events[i].end)
// 					{
// 						events[j].group++;
// 						if(events[j].group > group_size)
// 						{
// 							group_size = events[j].group;
// 						}
// 					}
// 				}
// 				createEvents(events, group_size + 1);
// 				if(j<=events.length){
// 					console.log(i,j, group_size);
// 					loop2();
// 				}
// 				j++;
// 			},900)
// 		}
// 		loop2();
// 		if(i<=events.length) {
// 			loop1();
// 		}
// 		i++;
// 	}, 1000);
// }

// loop1();
