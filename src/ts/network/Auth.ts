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
      console.log('%csaving session..', Utils.LOG_NETWORK)
      return new Promise((resolve => {

        if (self.owner.saveSession) localStorage.bidon_session_token = session.token
        else localStorage.bidon_session_token = undefined

        self._session = session
        console.log(`%c--saved session ${session.user_id}`, Utils.LOG_NETWORK)
        resolve()
      }))
    }

    const authenticate = () => {
      console.log('%cauthenticating new user..', Utils.LOG_NETWORK)
        return new Promise(((resolve, reject) => {
          try {
            const randomId = Utils.randomStr(8)
            return self.owner.nakama.authenticateEmail({
              email: `${randomId}@email.duh`,
              password: `${randomId}`
            })
              .then(session => {console.log('%c--success', Utils.LOG_NETWORK); return storeSession(session)})
              .then(resolve)
              .catch(reject)
          } catch (e) {
            reject(e)
          }
        }))
      }

    const restoreSession = () => {
      console.log('%crestore session..', Utils.LOG_NETWORK)
        return new Promise(((resolve, reject) => {
          const jwt = self.owner.saveSession ? localStorage.bidon_session_token : ''
          if (typeof jwt === 'undefined' || jwt === '') {
            console.log('%c--unable to restore', Utils.LOG_NETWORK)
            return reject()
          }

          const session = Session.restore(jwt)
          if (session.isexpired(Date.now())) {
            console.log('%c--expired', Utils.LOG_NETWORK)
            return reject()
          }

          console.log('%c--success', Utils.LOG_NETWORK)
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