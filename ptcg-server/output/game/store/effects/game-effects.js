"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectOfAbilityEffect = exports.MoveCardsEffect = exports.DrawPrizesEffect = exports.EvolveEffect = exports.HealEffect = exports.KnockOutAttackEffect = exports.KnockOutEffect = exports.AttackEffect = exports.UseStadiumEffect = exports.UseAttackEffect = exports.TrainerPowerEffect = exports.PowerEffect = exports.UseTrainerPowerEffect = exports.UsePowerEffect = exports.RetreatEffect = exports.GameEffects = void 0;
const state_utils_1 = require("../state-utils");
var GameEffects;
(function (GameEffects) {
    GameEffects["RETREAT_EFFECT"] = "RETREAT_EFFECT";
    GameEffects["USE_ATTACK_EFFECT"] = "USE_ATTACK_EFFECT";
    GameEffects["USE_STADIUM_EFFECT"] = "USE_STADIUM_EFFECT";
    GameEffects["USE_POWER_EFFECT"] = "USE_POWER_EFFECT";
    GameEffects["POWER_EFFECT"] = "POWER_EFFECT";
    GameEffects["ATTACK_EFFECT"] = "ATTACK_EFFECT";
    GameEffects["KNOCK_OUT_EFFECT"] = "KNOCK_OUT_EFFECT";
    GameEffects["HEAL_EFFECT"] = "HEAL_EFFECT";
    GameEffects["EVOLVE_EFFECT"] = "EVOLVE_EFFECT";
    GameEffects["DRAW_PRIZES_EFFECT"] = "DRAW_PRIZES_EFFECT";
    GameEffects["MOVE_CARDS_EFFECT"] = "MOVE_CARDS_EFFECT";
    GameEffects["EFFECT_OF_ABILITY_EFFECT"] = "EFFECT_OF_ABILITY_EFFECT";
})(GameEffects = exports.GameEffects || (exports.GameEffects = {}));
class RetreatEffect {
    constructor(player, benchIndex) {
        this.type = GameEffects.RETREAT_EFFECT;
        this.preventDefault = false;
        this.ignoreStatusConditions = false;
        this.player = player;
        this.benchIndex = benchIndex;
        this.moveRetreatCostTo = player.discard;
    }
}
exports.RetreatEffect = RetreatEffect;
class UsePowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
exports.UsePowerEffect = UsePowerEffect;
class UseTrainerPowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
exports.UseTrainerPowerEffect = UseTrainerPowerEffect;
class PowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
exports.PowerEffect = PowerEffect;
class TrainerPowerEffect {
    constructor(player, power, card) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
    }
}
exports.TrainerPowerEffect = TrainerPowerEffect;
class UseAttackEffect {
    constructor(player, attack) {
        this.type = GameEffects.USE_ATTACK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
        this.source = player.active;
    }
}
exports.UseAttackEffect = UseAttackEffect;
class UseStadiumEffect {
    constructor(player, stadium) {
        this.type = GameEffects.USE_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.stadium = stadium;
    }
}
exports.UseStadiumEffect = UseStadiumEffect;
class AttackEffect {
    constructor(player, opponent, attack) {
        this.type = GameEffects.ATTACK_EFFECT;
        this.preventDefault = false;
        this.ignoreWeakness = false;
        this.ignoreResistance = false;
        this.player = player;
        this.opponent = opponent;
        this.attack = attack;
        this.damage = attack.damage;
        this.source = player.active;
    }
}
exports.AttackEffect = AttackEffect;
// how many prizes when target Pokemon is KO
class KnockOutEffect {
    constructor(player, target) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.isLostCity = false;
        this.player = player;
        this.target = target;
        this.prizeCount = 1;
    }
}
exports.KnockOutEffect = KnockOutEffect;
// how many prizes when target Pokemon is KO
class KnockOutAttackEffect {
    constructor(player, target, attack) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.attack = attack;
        this.prizeCount = 1;
    }
}
exports.KnockOutAttackEffect = KnockOutAttackEffect;
class HealEffect {
    constructor(player, target, damage) {
        this.type = GameEffects.HEAL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.damage = damage;
    }
}
exports.HealEffect = HealEffect;
class EvolveEffect {
    constructor(player, target, pokemonCard) {
        this.type = GameEffects.EVOLVE_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonCard = pokemonCard;
    }
}
exports.EvolveEffect = EvolveEffect;
class DrawPrizesEffect {
    constructor(player, prizes, destination) {
        this.type = GameEffects.DRAW_PRIZES_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.prizes = prizes;
        this.destination = destination;
    }
}
exports.DrawPrizesEffect = DrawPrizesEffect;
class MoveCardsEffect {
    constructor(source, destination, options = {}) {
        this.type = GameEffects.MOVE_CARDS_EFFECT;
        this.preventDefault = false;
        this.source = source;
        this.destination = destination;
        this.cards = options.cards;
        this.count = options.count;
        this.toTop = options.toTop;
        this.toBottom = options.toBottom;
        this.skipCleanup = options.skipCleanup;
    }
}
exports.MoveCardsEffect = MoveCardsEffect;
class EffectOfAbilityEffect {
    constructor(player, power, card, state, targets, allowSelfTarget = false) {
        this.type = GameEffects.EFFECT_OF_ABILITY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.state = state;
        this.allowSelfTarget = allowSelfTarget;
        // Filter targets based on allowSelfTarget setting
        this._targets = targets === null || targets === void 0 ? void 0 : targets.filter(target => {
            const owner = state_utils_1.StateUtils.findOwner(state, target);
            return this.allowSelfTarget || owner.id !== this.player.id;
        });
    }
    // Helper method to check if a card is in any of the targets
    hasTarget(card) {
        if (!this._targets)
            return false;
        // Check ownership based on allowSelfTarget setting
        const cardList = state_utils_1.StateUtils.findCardList(this.state, card);
        const owner = state_utils_1.StateUtils.findOwner(this.state, cardList);
        if (!this.allowSelfTarget && owner.id === this.player.id)
            return false;
        return this._targets.some(target => target.cards.includes(card));
    }
    // Getter for backward compatibility
    get target() {
        var _a;
        return (_a = this._targets) === null || _a === void 0 ? void 0 : _a[0];
    }
    // Setter for backward compatibility
    set target(value) {
        // Check ownership based on allowSelfTarget setting
        if (value) {
            const owner = state_utils_1.StateUtils.findOwner(this.state, value);
            if (!this.allowSelfTarget && owner.id === this.player.id) {
                this._targets = undefined;
            }
            else {
                this._targets = [value];
            }
        }
        else {
            this._targets = undefined;
        }
    }
    // Getter for multiple targets
    get targets() {
        return this._targets;
    }
    // Setter for multiple targets
    set targets(value) {
        // Filter targets based on allowSelfTarget setting
        this._targets = value === null || value === void 0 ? void 0 : value.filter(target => {
            const owner = state_utils_1.StateUtils.findOwner(this.state, target);
            return this.allowSelfTarget || owner.id !== this.player.id;
        });
    }
}
exports.EffectOfAbilityEffect = EffectOfAbilityEffect;
