function speak(txt){ 
  var engine = window.speechSynthesis;    

  // get all voices that browser offers
  var available_voices = engine.getVoices();

  // this will hold an english voice
  var english_voice = '';

  // find voice by language locale "en-US"
  // if not then select the first voice
  available_voices = engine.getVoices();
  for(var i=0; i<available_voices.length; i++) {
    if(available_voices[i].lang == 'en-US') {
      english_voice = available_voices[i];
      break;
    }
  }
  if(english_voice == ''){
    english_voice = available_voices[0];
  }
  var utter = new SpeechSynthesisUtterance();
  utter.rate = 1;
  utter.pitch = 0.5;
  utter.text = txt;
  utter.voice = english_voice;

  window.speechSynthesis.speak(utter);
}

function array_elements(arr, target){
  for (let i = 0;i< arr.length;i++) {
    if (arr[i] != target){
      return false;
    }
  }
  return true;
}