import { SessionDataError } from '../../../utils/errors'
import { retrieveQuestionResponseFromSession } from '../../../utils/utils'
import TasklistPage from '../../tasklistPage'
import { SentenceTypesT } from './sentenceType'

const situations = {
  riskManagement: 'Referral for risk management',
  residencyManagement: 'Residency management',
  bailAssessment: 'Bail assessment for community penalty',
  bailSentence: 'Bail sentence',
} as const

type CommunityOrderSituations = Pick<typeof situations, 'riskManagement' | 'residencyManagement'>
type BailPlacementSituations = Pick<typeof situations, 'bailAssessment' | 'bailSentence'>
type SentenceType = Extract<SentenceTypesT, 'communityOrder' | 'bailPlacement'>

export default class Situation implements TasklistPage {
  name = 'situation'

  title = 'Which of the following options best describes the situation?'

  body: { situation: keyof (CommunityOrderSituations | BailPlacementSituations) }

  situations: CommunityOrderSituations | BailPlacementSituations

  constructor(body: Record<string, unknown>, session: Record<string, unknown>) {
    const sessionSentenceType = retrieveQuestionResponseFromSession<SentenceType>(session, 'sentenceType')

    this.situations = this.getSituationsForSentenceType(sessionSentenceType)

    this.body = {
      situation: body.situation as keyof (CommunityOrderSituations | BailPlacementSituations),
    }
  }

  next() {
    return 'release-date'
  }

  previous() {
    return 'sentence-type'
  }

  errors() {
    const errors = []

    if (!this.body.situation) {
      errors.push({
        propertyName: '$.situation',
        errorType: 'empty',
      })
    }

    return errors
  }

  items() {
    return Object.keys(this.situations).map(key => {
      return {
        value: key,
        text: this.situations[key],
        checked: this.body.situation === key,
      }
    })
  }

  getSituationsForSentenceType(sessionSentenceType: SentenceType): CommunityOrderSituations | BailPlacementSituations {
    if (sessionSentenceType === 'communityOrder') {
      return { riskManagement: situations.riskManagement, residencyManagement: situations.residencyManagement }
    }
    if (sessionSentenceType === 'bailPlacement') {
      return { bailAssessment: situations.bailAssessment, bailSentence: situations.bailSentence }
    }
    throw new SessionDataError(`Unknown sentence type ${sessionSentenceType}`)
  }
}
