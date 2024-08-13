import type Pbf from "pbf";

export interface IMigrationPayload {
  parameters: IOtpParameters[];
  version: number;
  batch_size: number;
  batch_index: number;
  batch_id: number;
}

export interface IOtpParameters {
  secret: Uint8Array | null;
  name: string;
  issuer: string;
  algorithm: number;
  digits: number;
  type: number;
  counter: number;
}

export const MigrationPayload = {
  read(pbf: Pbf, end?: any): IMigrationPayload {
    return pbf.readFields(
      MigrationPayload._readField,
      {
        parameters: [],
        version: 0,
        batch_size: 0,
        batch_index: 0,
        batch_id: 0,
      } as IMigrationPayload,
      end
    );
  },
  _readField(tag: number, obj?: IMigrationPayload, pbf?: Pbf) {
    if (!pbf || !obj) throw new Error("Pbf is undefined");
    if (tag === 1)
      obj.parameters.push(
        MigrationPayload.OtpParameters.read(pbf, pbf.readVarint() + pbf.pos)
      );
    else if (tag === 2) obj.version = pbf.readVarint(true);
    else if (tag === 3) obj.batch_size = pbf.readVarint(true);
    else if (tag === 4) obj.batch_index = pbf.readVarint(true);
    else if (tag === 5) obj.batch_id = pbf.readVarint(true);
  },
  write(obj: IMigrationPayload, pbf: Pbf) {
    if (obj.parameters)
      for (let i = 0; i < obj.parameters.length; i++)
        pbf.writeMessage(
          1,
          MigrationPayload.OtpParameters.write,
          obj.parameters[i]
        );
    if (obj.version) pbf.writeVarintField(2, obj.version);
    if (obj.batch_size) pbf.writeVarintField(3, obj.batch_size);
    if (obj.batch_index) pbf.writeVarintField(4, obj.batch_index);
    if (obj.batch_id) pbf.writeVarintField(5, obj.batch_id);
  },

  Algorithm: {
    INVALID: {
      value: 0,
      options: {},
    },
    SHA1: {
      value: 1,
      options: {},
    },
  },

  Algorithms: ["INVALID", "SHA1"],

  OtpType: {
    OTP_INVALID: {
      value: 0,
      options: {},
    },
    OTP_HOTP: {
      value: 1,
      options: {},
    },
    OTP_TOTP: {
      value: 2,
      options: {},
    },
  },

  // MigrationPayload.OtpParameters ========================================

  OtpParameters: {
    read(pbf: Pbf, end?: any): IOtpParameters {
      return pbf.readFields(
        MigrationPayload.OtpParameters._readField,
        {
          secret: null,
          name: "OTP",
          issuer: "Migration",
          algorithm: 1,
          digits: 6,
          type: 0,
          counter: 0,
        },
        end
      );
    },
    _readField(tag: number, obj?: IOtpParameters, pbf?: Pbf) {
      if (!pbf || !obj) throw new Error("Pbf is undefined");
      if (tag === 1) obj.secret = pbf.readBytes();
      else if (tag === 2) obj.name = pbf.readString();
      else if (tag === 3) obj.issuer = pbf.readString();
      else if (tag === 4) obj.algorithm = pbf.readVarint();
      else if (tag === 5) obj.digits = pbf.readVarint(true);
      else if (tag === 6) obj.type = pbf.readVarint();
      else if (tag === 7) obj.counter = pbf.readVarint(true);
    },
    write(obj: IOtpParameters, pbf?: Pbf) {
      if (!pbf) throw new Error("Pbf is undefined");
      if (obj.secret) pbf.writeBytesField(1, obj.secret);
      if (obj.name) pbf.writeStringField(2, obj.name);
      if (obj.issuer) pbf.writeStringField(3, obj.issuer);
      if (obj.algorithm) pbf.writeVarintField(4, obj.algorithm);
      if (obj.digits) pbf.writeVarintField(5, obj.digits);
      if (obj.type) pbf.writeVarintField(6, obj.type);
      if (obj.counter) pbf.writeVarintField(7, obj.counter);
    },
  },
};
