interface SkillsRawData {
    skillId: number | null
    skill: string
}

export class Skill implements SkillsRawData {
    skillId: number | null
    skill: string

    constructor(skillId: number | null, skill: string) {
        this.skillId = skillId
        this.skill = skill
    }

    static fromJsonObject(obj: SkillsRawData): Skill | null {
        try {
            return new Skill(obj.skillId, obj.skill)
        } catch (e) {
            console.error(e)
            return null
        }
    }
}
