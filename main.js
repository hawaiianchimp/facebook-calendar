


var events = [ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ];
layOutDay(events);



function test(){
	var events = [];
	var size = Math.floor(Math.random()*200);
	for(var i=0; i<size;i++){
		events.push({
		start: Math.floor((Math.random() * 720)),
		end: Math.floor((Math.random() * 720))
	});
	}
	layOutDay(events);
}


function layOutDay(events) { 
	var cal_width = 600;
	var cal_height = 720;
	var cal_padding = 10;
	var group_size = 0;


	var cal = document.querySelector("#calendar");
	cal.innerHTML = "";
	cal.style.width = cal_width + "px";
	cal.style.height = cal_height + "px";
	cal.style.padding = "0 " + cal_padding + "px";

	for(var k=0;k<events.length;k++){
		events[k].group = 0;
	}

	for(var i=0; i<events.length;i++){
		for(var j=0; j<events.length;j++)
		{
			if((i !== j) && (events[i].group === events[j].group)){

				if(events[j].start >= events[i].start && events[j].start < events[i].end)
				{
					events[j].group++;
					if(events[j].group > group_size)
					{
						group_size = events[j].group;
					}
				}

			}
		}
	}
	console.log(events, events.length, createEvents(events, group_size + 1), group_size + 1);

	function createEvent(event, width){
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

			el.style.width = (width) + "px";
			el.style.left = (event.group*width + cal_padding) + "px";
			var cal = document.querySelector("#calendar");
			el.appendChild(frame);
			cal.appendChild(el);
			return 1;
		}
		return 0;
	}

	function createEvents(events, group_size){
		var count = 0;
		var cal = document.querySelector("#calendar");
		var width = (cal_width/group_size);
		for(event in events){
			count += createEvent(events[event], width);
		}
		return count;
	}

}