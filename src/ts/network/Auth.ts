import {Connection} from "./Connection";
import {Session} from "@heroiclabs/nakama-js";
import {LogTag, Utils} from "../utils/Utils";

export class Auth {

  private owner: Connection
  private _session : Session = null; get session() { return this._session }

  constructor(owner: Connection) {
    this.owner = owner
  }

  public connect() {
    const self = this
    const storeSession = (session: Session) => {
        Utils.log(LogTag.NETWORK, 'saving session..')
        return new Promise((resolve => {

          if (self.owner.saveSession) localStorage.bidon_session_token = session.token
          else localStorage.bidon_session_token = undefined

          self._session = session
          Utils.log(LogTag.NETWORK, `  successfully saved session of ${session.user_id}`)
          resolve()
        }))
      }

    const authenticate = () => {
      Utils.log(LogTag.NETWORK, 'authenticating new user..')
        return new Promise(((resolve, reject) => {
          try {
            const randomId = Utils.randomStr(8)
            return self.owner.nakama.authenticateEmail({
              email: `${randomId}@email.duh`,
              password: `${randomId}`
            })
              .then(session => {Utils.log(LogTag.NETWORK, '  success!'); return storeSession(session)})
              .then(resolve)
              .catch(reject)
          } catch (e) {
            reject(e)
          }
        }))
      }

    const restoreSession = () => {
      Utils.log(LogTag.NETWORK, 'restore session..')
        return new Promise(((resolve, reject) => {
          const jwt = self.owner.saveSession ? localStorage.bidon_session_token : ''
          if (typeof jwt === 'undefined' || jwt === '') {
            Utils.log(LogTag.NETWORK, '  unable to restore')
            return reject()
          }

          const session = Session.restore(jwt)
          if (session.isexpired(Date.now())) {
            Utils.log(LogTag.NETWORK, '  expired')
            return reject()
          }

          Utils.log(LogTag.NETWORK, '  success')
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