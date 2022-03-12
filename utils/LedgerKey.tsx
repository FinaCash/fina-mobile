/* eslint-disable no-undef */
import TerraApp from '@terra-money/ledger-terra-js'
import { Key, SignDoc, SignatureV2, PublicKey } from '@terra-money/terra.js'
import { signatureImport } from 'secp256k1'
import { defaultHdPath, defaultPrefix } from './terraConfig'

class LedgerKey extends Key {
  public terraApp: TerraApp | undefined
  public hdPath = defaultHdPath
  public prefix = defaultPrefix

  public constructor(publicKey: PublicKey, terraApp: TerraApp, hdPath: number[], prefix: string) {
    super(publicKey)
    this.publicKey = publicKey
    this.terraApp = terraApp
    this.hdPath = hdPath
    this.prefix = prefix
  }

  public sign(): Promise<Buffer> {
    throw new Error('LedgerKey does not use sign() -- use createSignature() directly.')
  }

  public async createSignatureAmino(tx: SignDoc): Promise<SignatureV2> {
    const pubkeyResponse = await this.terraApp?.getAddressAndPubKey(this.hdPath, this.prefix)
    const pubkeyBuffer = Buffer.from(pubkeyResponse?.compressed_pk as any)

    if (!pubkeyBuffer) {
      throw new Error('failed getting public key from ledger')
    }

    const signResponse = await this.terraApp?.sign(this.hdPath, tx.toAminoJSON())
    const signatureBuffer = Buffer.from(
      signatureImport(Buffer.from(signResponse?.signature as any))
    )

    if (!signatureBuffer) {
      throw new Error('failed signing from ledger')
    }

    return new SignatureV2(
      this.publicKey!,
      new SignatureV2.Descriptor(
        new SignatureV2.Descriptor.Single(
          SignatureV2.SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
          signatureBuffer.toString('base64')
        )
      ),
      tx.sequence
    )
  }
}

export default LedgerKey
