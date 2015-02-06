$(document).ready(function(){

	var j = 0;
	var previous_voice = "Nora";
	var current_voice = "Nora";
	var voices_loaded = false;



	//Setting up the Web Speech API
	// event thats triggered when the voices are ready. Populates the voice selector with options
	window.speechSynthesis.onvoiceschanged = function(){
	voices = speechSynthesis.getVoices();
	}

	// adding an event listener to when the user clicks one of the audio-icons
	$(document).on('click', ".audio_link" , function(){
		if (window.speechSynthesis.speaking == true)
		{
			window.speechSynthesis.cancel();
		}
		else
		{
			var title = $(this).attr("id");
			readHeadline(title);
		} 
	});

	// getting the web speech api to read the message, and fetching the choosen voice
	function readHeadline(input){	
	message = new SpeechSynthesisUtterance(input);	
	message.voice = voices.filter(function(voice_alternative){ 
		return voice_alternative.name == current_voice; 
	})[0];
	window.speechSynthesis.speak(message);
	}


	// clicking the "Languages" button. 
	$("#character_activator").click(function(){
		$(this).animate({width: 'hide'}, 150 , function(){
				fetchVoices();
		});
	});

	var characters = ['Diego','Thomas','Ioana','Tarik', 
	'Hysterical','Bruce','Alice', 'Nora','Xander', 'Amelie','Kyoko'];

	// Finding the available the character elements
	function fetchVoices(){
	voices.map(function(voice){
		for (i=0;i<characters.length; i++)
			if (voice.name == characters[i]) {
				character_elements.push('<li class="character"><img class="image" src="img/' + voice.name +'.jpg" id= ' + voice.name + '></li>');	
		}
	});
	renderCharacters();
	voices_loaded = true;
	}

	var character_elements = [];

	// Adding the characters to the HTML
	function renderCharacters(){
			$("#Nora").css({height: "100px"});
		setTimeout(function(){
			$('#charSelector').append(character_elements[j]);
			j++;
			if (j<character_elements.length){
				renderCharacters();
			}
		}, 50)
	}

	// When user clicks on a character.
	$("#charSelector").on('click', '.image',function(){
		current_voice = $(this).attr('id');
		$("#"+previous_voice).animate({height: "50px"});
		$("#"+current_voice).animate({height: "100px"})
		previous_voice = current_voice;
	});

	// list of categories to be displayed at default
	var categories = ["technology","sport","politics"];
	var articles = {};

	// Ajax call to The Guradian API
	function getArticles(category) {
		$.ajax({
			url: "http://content.guardianapis.com/search?q=" + category + "&api-key=v2jpnga8trgw9x4p3u84yvrw",
			dataType: 'jsonp',
			success: function(json){
				articles[category] = json.response.results; // 
				renderArticles(articles, category);
			}
		});
	}

	categories.map(function(category) {
		getArticles(category);
	})

	// Adding the fetched elements to the page
	function renderArticles(articles, category) {
		var listItems = [];
		articles[category].map(function(article){
			var link  = '<a href="' +article.webUrl + '" id="link">'+ article.webTitle +'</a>';
			var img   = '<img class="audio" src="img/audio.png">';
			var audio = '<a class="audio_link" id="' + article.webTitle  +  '">' +img +'</a>';
			var item  = '<li>' +link +audio + '</li>';
			listItems.push(item);
		})

		$("li").removeClass("active");
		$("div").removeClass("active in");

		$("#myTab").append("<li id='tab-" + category + "'class='active'><a href='#" + category + "link' data-toggle='tab'>" + category + "</a>" + '<i id='+ category + ' class="fa fa-times">' + "</i></li>");
		$("#myTabContent").append("<div class='tab-pane fade active in' id='" + category + "link'><ol id = '" + category + "-articles' class='articles-list'></ol></div>");

		var id = '#'+ category +'-articles'
		$(id).append(listItems.join(""));
		return;
	}


	// Adding tab functionality 
	$("#add").click(function(){
		var exists;
		var search = document.getElementById("input").value;
		var searchLower = search.toLowerCase();

		for (var i=0; i<categories.length; i++){
			if (searchLower == categories[i]){
				exists = true;
				break;
			}
			else{
				exists = false;
			}		
		}

		if (exists)
		{
			$("li").removeClass("active");
			$("div").removeClass("active in");	

			$("#tab-" + searchLower).addClass("active");
			$("#" + searchLower + "link").addClass("active in");	
		}
		else
		{
			categories.push(searchLower);
			getArticles(searchLower);
		}
		$("#category").html("").append("#"+search);
	});

	// closing a tab functionality
	 $(document).on("click", ".fa-times",function(){  
	  //for elements inserted via jquery, use this document thing.  
	  
	 	var category = $(this).attr("id");
	 	//var categoryindex = categories.indexOf(category) ;

	 	$("#tab-" + category).remove();
	 	$("#" + category + "link").remove();

	 	var index = $.inArray(category, categories);
	 	if(index != -1){
	 		categories.splice(index,1);
	 	}

	 	var categoryindex = categories[0];
	 	console.log(categoryindex);

	 	$("li").removeClass("active");
		$("div").removeClass("active in");	

		$("#tab-" + categoryindex).addClass("active");
		$("#" + categoryindex + "link").addClass("active in");	
	 });
// end of JS
});


