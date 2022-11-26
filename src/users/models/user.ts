import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Services } from './services';
import * as bcrypt from 'bcrypt';
import randToken from 'rand-token';
import { UserFields } from '../enums/userFields';

export type UserDocument = HydratedDocument<User>;

export const roles = ['admin', 'support', 'consumer'];

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop()
  roles: string;

  @Prop({
    type: { facebook: String, github: String, google: String },
    ref: 'Services',
  })
  services: Services;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  friends: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.path('email').set(function (email: string) {
  if (!this.name) {
    this.name = email.replace(/^(.+)@.+$/, '$1');
  }

  if (
    !this.picture ||
    this.picture.indexOf('https://avatars.dicebear.com') === 0
  ) {
    this.picture = `https://avatars.dicebear.com/api/male/${this.name}.svg`;
  }

  return email;
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const rounds = 9;

  this.password = await bcrypt.hash(this.password, rounds);
});

UserSchema.statics = {
  createFromService({ service, id, email, name, picture }) {
    return this.findOne({
      $or: [{ [`services.${service}`]: id }, { email }],
    }).then(
      (user: {
        services: { [x: string]: any };
        name: any;
        picture: any;
        verify: boolean;
        save: () => any;
      }) => {
        if (user) {
          if (user) {
            user.services[service] = id;
            user.name = name;
            user.picture = picture;
            user.verify = true;
            return user.save();
          } else {
            const password = randToken.generate(16);
            return this.create({
              services: { [service]: id },
              email,
              password,
              name,
              picture,
            });
          }
        }
      },
    );
  },
};

UserSchema.methods = {
  view: function (full: boolean) {
    const view: any = {};
    let fields = [UserFields.id, UserFields.name, UserFields.picture];

    if (full) {
      fields = [...fields, UserFields.email, UserFields.friends];
    }

    fields.forEach((field) => {
      view[field] = this[field];
    });
    return view;
  },
};
