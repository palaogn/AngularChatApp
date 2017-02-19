import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  socket: any;

  constructor() {
    this.socket = io('http://localhost:8080/');
    this.socket.on('connect', function(){
      console.log('connect');
  });
}

  login(userName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('adduser', userName, succeeded => {
        console.log('Reply received');
        observer.next(succeeded);
      });
    });

    return observable;
  }

  joinRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      const param = {
        room: roomName
      };
      this.socket.emit('joinroom', param, function(a: boolean) {
          observer.next(a);
      });
    });

    return observable;
  }

  leaveRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      this.socket.emit('partroom', roomName, function(a: boolean) {
        observer.next(a);
      });
    });

    return observable;
  }

  getRoomList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('rooms');
      this.socket.on('roomlist', (lst) => {
        const strArr: string[] = [];
        for (const x in lst) {
          strArr.push(x);
        }
        observer.next(strArr);
      });
    });
    return obs;
  }

  getRoomMessages(roomName: string): Observable<string[]> {
    console.log("Getting messages")
    const obs = new Observable(observer => {
      this.socket.on('updatechat', (roomName, messages) => {
        console.log(messages);
        observer.next(messages);
      });
    });
    return obs;
  }

  getUserList(): Observable<string[]> {
    const obs = new Observable(observer => {
      this.socket.emit('users');
      this.socket.on('userlist', (lst) => {
        observer.next(lst);
      });
    });
    return obs;
  }

  getConnectedUserList(roomName: string, op: string): Observable<string[]> {
    const obs = new Observable(observer => {
      console.log("get connected users");
      this.socket.on('updateusers', (roomName, users, op) => {
        console.log("users:");
        console.log(users);
        const strArr: string[] = [];
        for (const x in users) {
          strArr.push(x);
        }
        observer.next(strArr);
      });
    });
    return obs;
  }

  addRoom(roomName: string): Observable<boolean> {
    const observable = new Observable(observer => {
      // TODO validate that the room name is validate
      const param = {
        room: roomName
      };
      this.socket.emit('joinroom', param, function(a: boolean) {
          observer.next(a);
      });
    });

    return observable;
  }

sendMessage(room: string, messsage: string): Observable<boolean> {
  const obs = new Observable(observer => {
    const param = {
      roomName: room,
      msg: messsage
    }
    this.socket.emit('sendmsg', param, function(a: boolean) {
      observer.next(a);
    })
  });

  return obs;

}


}
