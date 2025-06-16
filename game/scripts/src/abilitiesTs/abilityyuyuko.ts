import { BaseAbility, BaseModifier, registerAbility, registerModifier } from '../utils/dota_ts_adapter';

@registerAbility()
export class ability_thdots_yuyukoEx extends BaseAbility {
    override GetMinLevel(): number {
        return 1;
    }

    override GetIntrinsicModifierName(): string {
        return 'modifier_thdots_yuyukoex_passive';
    }
}

@registerModifier()
export class modifier_thdots_yuyukoex_passive extends BaseModifier {
    private caster: CDOTA_BaseNPC = null;
    private ability: CDOTABaseAbility = null;
    private duration: number = null;

    override IsDebuff(): boolean {
        return false;
    }

    override IsHidden(): boolean {
        return false;
    }

    override IsPurgable(): boolean {
        return false;
    }

    override OnCreated(params: object): void {
        if (!IsServer()) {
            return;
        }

        this.caster = this.GetCaster();
        this.ability = this.GetAbility();

        this.duration = this.ability.GetSpecialValueFor('duration');
    }

    override DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MIN_HEALTH, ModifierFunction.ON_TAKEDAMAGE];
    }

    override GetMinHealth(): number {
        return this.GetCaster().IsRealHero() && !this.GetCaster().HasModifier('modifier_thdots_yuyukoex_deathrattle') ? 1 : 0;
    }

    /**
     * 死亡触发亡语状态
     * @param event
     * @returns
     */
    override OnTakeDamage(event: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }

        if (event.unit != this.caster || !this.caster.IsRealHero()) {
            return;
        }

        if (event.damage >= this.caster.GetHealth()) {
            this.Destroy();

            this.caster.SetHealth(this.caster.GetMaxHealth());
            this.caster.AddNewModifier(this.caster, this.ability, 'modifier_thdots_yuyukoex_deathrattle', {
                duration: this.duration,
            });
        }
    }
}

@registerModifier()
export class modifier_thdots_yuyukoex_deathrattle extends BaseModifier {
    private caster: CDOTA_BaseNPC = null;
    private ability: CDOTABaseAbility = null;
    private maxDistance: number;
    // 最后一次攻击者
    private lastAttacker: CDOTA_BaseNPC;
    // 起始位置
    private startPosition: Vector;

    override IsDebuff(): boolean {
        return false;
    }

    override IsHidden(): boolean {
        return false;
    }

    override IsPurgable(): boolean {
        return false;
    }

    override OnCreated(params: object): void {
        if (!IsServer()) {
            return;
        }

        this.caster = this.GetCaster();
        this.ability = this.GetAbility();

        this.maxDistance = this.ability.GetSpecialValueFor('max_distance');

        this.startPosition = this.caster.GetOrigin();

        let effectIndex = ParticleManager.CreateParticle(
            'particles/thd2/heroes/yuyuko/ability_yuyuko_04_effect.vpcf',
            ParticleAttachment.CUSTOMORIGIN,
            this.caster
        );
        ParticleManager.SetParticleControl(effectIndex, 0, this.caster.GetOrigin());
        ParticleManager.DestroyParticle(effectIndex, false);

        effectIndex = ParticleManager.CreateParticle(
            'particles/thd2/heroes/yuyuko/ability_yuyuko_04_effect_a.vpcf',
            ParticleAttachment.CUSTOMORIGIN,
            this.caster
        );
        ParticleManager.SetParticleControl(effectIndex, 0, this.caster.GetOrigin());
        ParticleManager.SetParticleControl(effectIndex, 5, this.caster.GetOrigin());
        ParticleManager.DestroyParticle(effectIndex, false);

        this.StartIntervalThink(1);
    }

    override OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }

        if (GetDistanceBetweenTwoVec2D.call(this.caster.GetOrigin(), this.startPosition) > this.maxDistance) {
            this.caster.SetOrigin(this.startPosition);
        }
    }

    override OnDestroy(): void {
        if (!IsServer()) {
            return;
        }

        if (!this.caster.IsRealHero()) {
            return;
        }

        let attacker = null;
        if (this.lastAttacker != null && this.lastAttacker.IsNull()) {
            attacker = this.lastAttacker;
        } else {
            let units = FindUnitsInRadius(
                this.caster.GetTeam(),
                this.caster.GetOrigin(),
                null,
                10000,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO,
                UnitTargetFlags.NONE,
                FindOrder.CLOSEST,
                false
            );
            attacker = units.length > 0 ? units.at(0) : null;
        }
        this.caster.Kill(this.ability, attacker);
    }

    override DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            ModifierFunction.ABSOLUTE_NO_DAMAGE_MAGICAL,
            ModifierFunction.ABSOLUTE_NO_DAMAGE_PURE,
            ModifierFunction.ON_TAKEDAMAGE,
        ];
    }

    override GetAbsoluteNoDamagePhysical(event: ModifierAttackEvent): 0 | 1 {
        return 1;
    }

    override GetAbsoluteNoDamageMagical(event: ModifierAttackEvent): 0 | 1 {
        return 1;
    }

    override GetAbsoluteNoDamagePure(event: ModifierAttackEvent): 0 | 1 {
        return 1;
    }

    override OnTakeDamage(event: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }

        if (event.unit != this.caster || !this.caster.IsRealHero()) {
            return;
        }

        this.lastAttacker = event.attacker;
    }
}
