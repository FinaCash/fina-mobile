/**
 * Class to allow us to refer to the app state service
 */

export class AppStateService {
  static instance: any

  static STATE_ACTIVE = 'active'
  static STATE_INACTIVE = 'inactive'
  static STATE_BACKGROUND = 'background'
  static STATE_NOT_LAUNCHED = 'not_launched'

  previousState = AppStateService.STATE_NOT_LAUNCHED
  currentState = AppStateService.STATE_ACTIVE

  handlers: any = {}

  appLaunchId = 0

  /**
   * @returns {AppStateService}
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new AppStateService()
    }

    return this.instance
  }

  static init = () => {
    // This func need to be call in the App.js, it's just here to create the instance
    const instance = AppStateService.getInstance()

    instance.appLaunchId = new Date().getTime() / 1000
  }

  handleAppStateChange = (nextState: any) => {
    if (nextState !== this.currentState) {
      this.previousState = this.currentState
      this.currentState = nextState

      for (const [key, handler] of Object.entries(this.handlers)) {
        ;(handler as any)(nextState)
      }
    }
  }

  getCurrentState = () => {
    return this.currentState
  }

  getPreviousState = () => {
    return this.previousState
  }

  addStateHandler = (key: string, handler: any) => {
    this.handlers[key] = handler
  }

  hasStateHandler = (key: string) => {
    if (this.handlers[key]) {
      return true
    }

    return false
  }

  removeStateHandler = (key: string) => {
    delete this.handlers[key]
  }
}
