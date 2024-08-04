import fetch from 'isomorphic-fetch';

addEventListener('message', async e => {
  console.log(e.data);
  const res =   fetch('/api/linkedin/updateCampaignUtm', e.data)
  //const text = await res.text();
  postMessage('Done.');
});

// onmessage =   function(e){
//     console.log(e);
//       fetch('/api/linkedin/updateCampaignUtm', e.data)
//     postMessage('return message')
// } 
// addEventListener('message', (e) => {
//     console.log(e);
//     loadEdit(e)
//     //.then(/* callback function here */);
    
// },false);

//   function loadEdit(e) {
//       fetch('/api/linkedin/updateCampaignUtm', e.data)
// }