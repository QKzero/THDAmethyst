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

        this.caster.AddNewModifier(this.caster, this.ability, 'modifier_thdots_yuyukoex_listener', {});
        this.caster.AddNewModifier(this.caster, this.ability, 'modifier_thdots_yuyukoex_deathrattle', {});
    }

    override DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_RESPAWN];
    }

    override OnRespawn(event: ModifierUnitEvent): void {
        if (!IsServer()) {
            return;
        }

        if (event.unit != this.caster) {
            return;
        }

        this.caster.AddNewModifier(this.caster, this.ability, 'modifier_thdots_yuyukoex_listener', {});
        this.caster.AddNewModifier(this.caster, this.ability, 'modifier_thdots_yuyukoex_deathrattle', {});
    }
}

@registerModifier()
export class modifier_thdots_yuyukoex_listener extends BaseModifier {
    private caster: CDOTA_BaseNPC = null;
    private ability: CDOTABaseAbility = null;
    private parent: CDOTA_BaseNPC = null;
    private duration: number = 0;

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
        this.caster = this.GetCaster();
        this.ability = this.GetAbility();
        this.parent = this.GetParent();

        this.duration = this.ability.GetSpecialValueFor('duration');
    }

    override DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE, ModifierFunction.ON_DEATH];
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

        if (this.caster.GetHealth() == 0) {
            this.Destroy();

            this.caster.SetHealth(this.caster.GetMaxHealth());
        }
    }

    override OnDestroy(): void {
        if (!IsServer()) {
            return;
        }

        if (this.caster.HasModifier('modifier_thdots_yuyukoex_deathrattle')) {
            this.caster.FindModifierByName('modifier_thdots_yuyukoex_deathrattle').SetDuration(this.duration, true);
        }

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
    }
}

@registerModifier()
export class modifier_thdots_yuyukoex_deathrattle extends BaseModifier {
    private caster: CDOTA_BaseNPC = null;
    private ability: CDOTABaseAbility = null;
    // 最后一次攻击者
    private lastAttacker: CDOTA_BaseNPC;

    /**
     * 当监听器不存在，即被销毁后生效
     * @returns 是否有效
     */
    IsValid(): boolean {
        return this.GetCaster().HasModifier('modifier_thdots_yuyukoex_listener');
    }

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
        return this.IsValid() ? 1 : 0;
    }

    override GetAbsoluteNoDamageMagical(event: ModifierAttackEvent): 0 | 1 {
        return this.IsValid() ? 1 : 0;
    }

    override GetAbsoluteNoDamagePure(event: ModifierAttackEvent): 0 | 1 {
        return this.IsValid() ? 1 : 0;
    }

    override OnTakeDamage(event: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }

        if (event.unit != this.caster || !this.IsValid() || !this.caster.IsRealHero()) {
            return;
        }

        this.lastAttacker = event.attacker;
    }
}
