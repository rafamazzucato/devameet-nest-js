import { Logger } from '@nestjs/common/services';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { DoMovementDto } from './dtos/domovement.dto';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { TogglMuteDto } from './dtos/togglMute.dto';
import { UpdatePositionDto } from './dtos/updateposition.dto';
import { RoomService } from './room.service';

@WebSocketGateway({ cors: true })
export class RoomGateway implements OnGatewayInit,  OnGatewayDisconnect {
  constructor(
    private readonly service: RoomService) { }

  @WebSocketServer() wss: Server;

  private activeSockets: { room: string; id: string, userId: string }[] = [];
  private logger: Logger = new Logger(RoomGateway.name);

  afterInit(server: Server) {
    this.logger.log('Gateway initialized');
  }

  async handleDisconnect(client: Socket) {
    const existingSocket = this.activeSockets.find(
      (socket) => socket.id === client.id,
    );

    if (!existingSocket) return;

    this.activeSockets = this.activeSockets.filter(
      (socket) => socket.id !== client.id,
    );
    await this.service.deleteUserPosition(client.id);
  
    client.broadcast.emit(`${existingSocket.room}-remove-user`, {
      socketId: client.id,
    });
  }

  @SubscribeMessage('join')
  async handleMessage(client: Socket, payload: JoinRoomDto): Promise<void> {
    const { link, userId } = payload;
    const existingSocket = this.activeSockets?.find(
      (socket) => socket.room === link && socket.id === client.id,
    );

    if (!existingSocket) {
      this.activeSockets.push({ room: link, id: client.id, userId });
      const dto = {
        x: 2,
        y: 2,
        orientation: 'down'
      } as UpdatePositionDto;

      await this.service.updateUserPosition(userId, link, client.id, dto);
      const users = await this.service.listUsersPosition(link);
      this.wss.emit(`${link}-update-user-list`, {
        users
      });

      client.broadcast.emit(`${link}-add-user`, {
        user: client.id,
      });
    }

    this.logger.log('Socket client: ' + client.id + ' start to join room: ' + link);
  }

  @SubscribeMessage('move')
  async handleMovement(client: Socket, payload: DoMovementDto): Promise<void> {
    const { link, userId, x, y, orientation } = payload;
    this.logger.log('Socket client: ' + client.id + ' start to join room: ' + link);

    const dto = {
      x,
      y,
      orientation
    } as UpdatePositionDto;

    await this.service.updateUserPosition(userId, link, client.id, dto);
    const users = await this.service.listUsersPosition(link);
    this.wss.emit(`${link}-update-user-list`, {
      users
    });
  }

  @SubscribeMessage('toggl-mute-user')
  async handleMute(_: Socket, payload: TogglMuteDto): Promise<void> {
    const {link} = payload;
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPosition(link);
    this.wss.emit(`${link}-update-user-list`, {
      users
    });
  }

  @SubscribeMessage('call-user')
  public callUser(client: Socket, data: any): void {
    this.logger.log('Socket callUser: ' + client.id + ' to: ' + data.to);
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage('make-answer')
  public makeAnswer(client: Socket, data: any): void {
    this.logger.log('Socket makeAnswer: ' + client.id + ' to: ' + data.to);
    client.to(data.to).emit('answer-made', {
      socket: client.id,
      answer: data.answer,
    });
  }
}
