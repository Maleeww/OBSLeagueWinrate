

var id = "NSX";















addWin();

function addWin(){
    fetch('http://9f9c73d.online-server.cloud:25564/adjust/win?id='+id, {
        method:'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'texth/html'}),
        //body: JSON.stringify({'puuid': puuid, 'region': region})
    })
}

function addLose(){
    fetch('http://9f9c73d.online-server.cloud:25564/adjust/lose?id='+id, {
        method:'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'texth/html'}),
        //body: JSON.stringify({'puuid': puuid, 'region': region})
    })
}
function reset(){
    fetch('http://9f9c73d.online-server.cloud:25564/adjust/reset?id='+id, {
        method:'get',                    
        redirect : 'follow',
        mode: 'cors' ,
        headers : new Headers({'Content-Type':'texth/html'}),
        //body: JSON.stringify({'puuid': puuid, 'region': region})
    })
}

