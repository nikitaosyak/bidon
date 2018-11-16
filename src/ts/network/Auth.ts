import {Connection} from "./Connection";
import {Session} from "@heroiclabs/nakama-js";
import {Utils} from "../utils/Utils";

export class Auth {

  private owner: Connection
  private _session : Session = null; get session() { return this._session }

  constructor(owner: Connection) {
    this.owner = owner
  }

  public connect() {
    const self = this
    const storeSession = (session: Session) => {
        console.log('saving session..')
        return new Promise((resolve => {

          if (self.owner.saveSession) localStorage.bidon_session_token = session.token
          else localStorage.bidon_session_token = undefined

          self._session = session
          console.log(`  successfully saved session of ${session.user_id}`)
          resolve()
        }))
      }

    const authenticate = () => {
        console.log('authenticating new user..')
        return new Promise(((resolve, reject) => {
          try {
            const randomId = Utils.randomStr(8)
            return self.owner.nakama.authenticateEmail({
              email: `nikita.osyak@gmail.com`,
              password: `${randomId}`
            })
              .then(session => {console.log('  success!'); return storeSession(session)})
              .then(resolve)
              .catch(reject)
          } catch (e) {
            reject(e)
          }
        }))
      }

    const restoreSession = () => {
        console.log('restore session..')
        return new Promise(((resolve, reject) => {
          const jwt = self.owner.saveSession ? localStorage.bidon_session_token : ''
          if (typeof jwt === 'undefined' || jwt === '') {
            console.log('  unable to restore')
            return reject()
          }

          const session = Session.restore(jwt)
          if (session.isexpired(Date.now())) {
            console.log('  expired')
            return reject()
          }

          console.log('  success')
          resolve(session)
        }))
      }

    return new Promise(((resolve, reject) => {
      restoreSession()
        .then(storeSession)
        .then(resolve)
        .catch(authenticate)
        .then(resolve)
        .catch(reject)
    }))
  }
}