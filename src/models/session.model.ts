import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import config from '../config';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import stringUtils from '../utils/stringUtils';

export interface ISession {
  _id: string;
  userId: string;
  token: string;
  userAgent: string;
  ip: string;
  valid: boolean;
}

export class Session {
  @prop({ required: true, unique: true })
  public _id: string;

  @prop({ required: true })
  public userId: string;

  @prop({ required: true, unique: true })
  public token: string;

  @prop()
  public userAgent: string;

  @prop({ required: true })
  public ip: string;

  @prop()
  public valid: boolean;

  @prop({ required: true, default: Date.now })
  public createdAt: Date;

  @prop({ required: true, default: Date.now })
  public updatedAt: Date;

  // Create new user Api
  public static async createSession(session: ISession) {
    const sessionExist = await SessionModel.findOne({ userId: session.userId });
    // console.log('session Exist', sessionExist);
    if (sessionExist) {
      //creating a new session for logged in user
      sessionExist.valid = false;
      await sessionExist.save();
    }

    const newSession = await SessionModel.create(session);
    await newSession.save();
  }
}

export const SessionModel = getModelForClass(Session);
export type SessionDoc = DocumentType<Session>;
