import React from 'react'

export default function Test() {

    const send_data = [{
        'userId' : 1,
        'title' : 'adasd',
        'body' : 'asd asdas asd this is body.'
    },{
        'userId' : 1,
        'title' : 'adasd',
        'body' : 'asd asdas asd this is body.'
    },{
        'userId' : 1,
        'title' : 'adasd',
        'body' : 'asd asdas asd this is body.'
    }   
    ]
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(send_data)
    }; 
    fetch('https://jsonplaceholder.typicode.com/posts',requestOptions).then(
        response => response.json())
    .then(json => console.log(json))

    fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
  
    return (
        <div>
            as
        </div>
    )
} 