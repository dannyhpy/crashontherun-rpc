import { genericKey } from '../constants.js'

import * as AppAbTestApi from './appAbTestApi.js'
import * as AppCommonCatalogApi from './appCommonCatalogApi.js'
import * as AppCoreIdentityApi from './appCoreIdentityApi.js'
import * as AppTimeApi from './appTimeApi.js'
import * as ConfigApi from './configApi.js'

async function genericStateUpdateHandler (_params, { sessionKey }) {
  if (sessionKey === null) {
    throw {
      code: 3,
      message: 'No session key error'
    }
  } else if (sessionKey === genericKey) {
    return { stateUpdateOutcome: 'CLIENT_REQUEST_ACCEPTED' }
  } else {
    throw {
      code: 2,
      message: 'Authentication error'
    }
  }
}

export default {
  'AdsApi.egpPurchase': genericStateUpdateHandler,
  'AppAbTestApi.getAppUserAbCases': AppAbTestApi.getAppUserAbCases,
  'AppCommonCatalogApi.getCatalog': AppCommonCatalogApi.getCatalog,
  'AppCoreIdentityApi.authenticate': AppCoreIdentityApi.authenticate,
  'AppCoreIdentityApi.logIn': AppCoreIdentityApi.logIn,
  'AppCoreIdentityApi.signUp': AppCoreIdentityApi.signUp,
  'AppStoreApi.createJournal4': async (_params) => null,
  'AppTimeApi.getServerTime': AppTimeApi.getServerTime,
  'ConfigApi.getConfigEntriesCached': ConfigApi.getConfigEntriesCached,
  'InventoryApi.convertCrashPoints': genericStateUpdateHandler,
  'MiloSeasonApi.claimSeasonWithoutTeamReward': genericStateUpdateHandler,
  'MiloSeasonApi.spendTeamRunTicket': genericStateUpdateHandler,
  'PackApi.claimPack': genericStateUpdateHandler,
  'ProductionApi.buyProducer': genericStateUpdateHandler,
  'ProductionApi.collectProducer': genericStateUpdateHandler,
  'ProductionApi.speedUpProducer': genericStateUpdateHandler,
  'ProductionApi.startProducer': genericStateUpdateHandler,
  'ProductionApi.startProducerMissingResources': genericStateUpdateHandler,
  'ProductionApi.upgradeBuilding': genericStateUpdateHandler,
  'ProductionApi.upgradeBuildingMissingResources': genericStateUpdateHandler,
  'ProgressApi.finishedTutorial': genericStateUpdateHandler,
  'ProgressApi.levelUpPlayer': genericStateUpdateHandler,
  'ProgressApi.startTutorial': genericStateUpdateHandler,
  'RunnerApi.endCollectionRun': genericStateUpdateHandler,
  'RunnerApi.endRun': genericStateUpdateHandler,
  'RunnerApi.playerDeath': genericStateUpdateHandler,
  //'ServerAuthLiveOpsApi.getLiveOps': ServerAuthLiveOpsApi.getLiveOps,
  'StateApi.syncState': genericStateUpdateHandler,
  'TrackingApi.appTrack2': async (_params) => null,
  'TrackingApi.getUniqueACId': async (_params) => '0',
  'UnlockApi.unlockBuildings': genericStateUpdateHandler,
  'UnlockApi.unlockIsland': genericStateUpdateHandler,
  'UnlockApi.unlockItems': genericStateUpdateHandler,
  'UnlockApi.unlockLand': genericStateUpdateHandler,
}
