import { bench } from '@arktype/attest';
import { a, ClientSchema } from '@aws-amplify/data-schema';
// import { Amplify } from 'aws-amplify';
// import { generateClient } from 'aws-amplify/api';

bench('baseline', () => {}).types([0, 'instantiations']);

/**
 * The following benchmarks are an extension of `p50.bench.ts`.
 * Here we perform CRUDL operations for a single model.
 */
bench('1522 simple models with 1 field each CRUDL', async () => {
  const schema = a
    .schema({
      Model1: a.model({
        field1: a.string(),
      }),
      Model2: a.model({
        field1: a.string(),
      }),
      Model3: a.model({
        field1: a.string(),
      }),
      Model4: a.model({
        field1: a.string(),
      }),
      Model5: a.model({
        field1: a.string(),
      }),
      Model6: a.model({
        field1: a.string(),
      }),
      Model7: a.model({
        field1: a.string(),
      }),
      Model8: a.model({
        field1: a.string(),
      }),
      Model9: a.model({
        field1: a.string(),
      }),
      Model10: a.model({
        field1: a.string(),
      }),
      Model11: a.model({
        field1: a.string(),
      }),
      Model12: a.model({
        field1: a.string(),
      }),
      Model13: a.model({
        field1: a.string(),
      }),
      Model14: a.model({
        field1: a.string(),
      }),
      Model15: a.model({
        field1: a.string(),
      }),
      Model16: a.model({
        field1: a.string(),
      }),
      Model17: a.model({
        field1: a.string(),
      }),
      Model18: a.model({
        field1: a.string(),
      }),
      Model19: a.model({
        field1: a.string(),
      }),
      Model20: a.model({
        field1: a.string(),
      }),
      Model21: a.model({
        field1: a.string(),
      }),
      Model22: a.model({
        field1: a.string(),
      }),
      Model23: a.model({
        field1: a.string(),
      }),
      Model24: a.model({
        field1: a.string(),
      }),
      Model25: a.model({
        field1: a.string(),
      }),
      Model26: a.model({
        field1: a.string(),
      }),
      Model27: a.model({
        field1: a.string(),
      }),
      Model28: a.model({
        field1: a.string(),
      }),
      Model29: a.model({
        field1: a.string(),
      }),
      Model30: a.model({
        field1: a.string(),
      }),
      Model31: a.model({
        field1: a.string(),
      }),
      Model32: a.model({
        field1: a.string(),
      }),
      Model33: a.model({
        field1: a.string(),
      }),
      Model34: a.model({
        field1: a.string(),
      }),
      Model35: a.model({
        field1: a.string(),
      }),
      Model36: a.model({
        field1: a.string(),
      }),
      Model37: a.model({
        field1: a.string(),
      }),
      Model38: a.model({
        field1: a.string(),
      }),
      Model39: a.model({
        field1: a.string(),
      }),
      Model40: a.model({
        field1: a.string(),
      }),
      Model41: a.model({
        field1: a.string(),
      }),
      Model42: a.model({
        field1: a.string(),
      }),
      Model43: a.model({
        field1: a.string(),
      }),
      Model44: a.model({
        field1: a.string(),
      }),
      Model45: a.model({
        field1: a.string(),
      }),
      Model46: a.model({
        field1: a.string(),
      }),
      Model47: a.model({
        field1: a.string(),
      }),
      Model48: a.model({
        field1: a.string(),
      }),
      Model49: a.model({
        field1: a.string(),
      }),
      Model50: a.model({
        field1: a.string(),
      }),
      Model51: a.model({
        field1: a.string(),
      }),
      Model52: a.model({
        field1: a.string(),
      }),
      Model53: a.model({
        field1: a.string(),
      }),
      Model54: a.model({
        field1: a.string(),
      }),
      Model55: a.model({
        field1: a.string(),
      }),
      Model56: a.model({
        field1: a.string(),
      }),
      Model57: a.model({
        field1: a.string(),
      }),
      Model58: a.model({
        field1: a.string(),
      }),
      Model59: a.model({
        field1: a.string(),
      }),
      Model60: a.model({
        field1: a.string(),
      }),
      Model61: a.model({
        field1: a.string(),
      }),
      Model62: a.model({
        field1: a.string(),
      }),
      Model63: a.model({
        field1: a.string(),
      }),
      Model64: a.model({
        field1: a.string(),
      }),
      Model65: a.model({
        field1: a.string(),
      }),
      Model66: a.model({
        field1: a.string(),
      }),
      Model67: a.model({
        field1: a.string(),
      }),
      Model68: a.model({
        field1: a.string(),
      }),
      Model69: a.model({
        field1: a.string(),
      }),
      Model70: a.model({
        field1: a.string(),
      }),
      Model71: a.model({
        field1: a.string(),
      }),
      Model72: a.model({
        field1: a.string(),
      }),
      Model73: a.model({
        field1: a.string(),
      }),
      Model74: a.model({
        field1: a.string(),
      }),
      Model75: a.model({
        field1: a.string(),
      }),
      Model76: a.model({
        field1: a.string(),
      }),
      Model77: a.model({
        field1: a.string(),
      }),
      Model78: a.model({
        field1: a.string(),
      }),
      Model79: a.model({
        field1: a.string(),
      }),
      Model80: a.model({
        field1: a.string(),
      }),
      Model81: a.model({
        field1: a.string(),
      }),
      Model82: a.model({
        field1: a.string(),
      }),
      Model83: a.model({
        field1: a.string(),
      }),
      Model84: a.model({
        field1: a.string(),
      }),
      Model85: a.model({
        field1: a.string(),
      }),
      Model86: a.model({
        field1: a.string(),
      }),
      Model87: a.model({
        field1: a.string(),
      }),
      Model88: a.model({
        field1: a.string(),
      }),
      Model89: a.model({
        field1: a.string(),
      }),
      Model90: a.model({
        field1: a.string(),
      }),
      Model91: a.model({
        field1: a.string(),
      }),
      Model92: a.model({
        field1: a.string(),
      }),
      Model93: a.model({
        field1: a.string(),
      }),
      Model94: a.model({
        field1: a.string(),
      }),
      Model95: a.model({
        field1: a.string(),
      }),
      Model96: a.model({
        field1: a.string(),
      }),
      Model97: a.model({
        field1: a.string(),
      }),
      Model98: a.model({
        field1: a.string(),
      }),
      Model99: a.model({
        field1: a.string(),
      }),
      Model100: a.model({
        field1: a.string(),
      }),
      Model101: a.model({
        field1: a.string(),
      }),
      Model102: a.model({
        field1: a.string(),
      }),
      Model103: a.model({
        field1: a.string(),
      }),
      Model104: a.model({
        field1: a.string(),
      }),
      Model105: a.model({
        field1: a.string(),
      }),
      Model106: a.model({
        field1: a.string(),
      }),
      Model107: a.model({
        field1: a.string(),
      }),
      Model108: a.model({
        field1: a.string(),
      }),
      Model109: a.model({
        field1: a.string(),
      }),
      Model110: a.model({
        field1: a.string(),
      }),
      Model111: a.model({
        field1: a.string(),
      }),
      Model112: a.model({
        field1: a.string(),
      }),
      Model113: a.model({
        field1: a.string(),
      }),
      Model114: a.model({
        field1: a.string(),
      }),
      Model115: a.model({
        field1: a.string(),
      }),
      Model116: a.model({
        field1: a.string(),
      }),
      Model117: a.model({
        field1: a.string(),
      }),
      Model118: a.model({
        field1: a.string(),
      }),
      Model119: a.model({
        field1: a.string(),
      }),
      Model120: a.model({
        field1: a.string(),
      }),
      Model121: a.model({
        field1: a.string(),
      }),
      Model122: a.model({
        field1: a.string(),
      }),
      Model123: a.model({
        field1: a.string(),
      }),
      Model124: a.model({
        field1: a.string(),
      }),
      Model125: a.model({
        field1: a.string(),
      }),
      Model126: a.model({
        field1: a.string(),
      }),
      Model127: a.model({
        field1: a.string(),
      }),
      Model128: a.model({
        field1: a.string(),
      }),
      Model129: a.model({
        field1: a.string(),
      }),
      Model130: a.model({
        field1: a.string(),
      }),
      Model131: a.model({
        field1: a.string(),
      }),
      Model132: a.model({
        field1: a.string(),
      }),
      Model133: a.model({
        field1: a.string(),
      }),
      Model134: a.model({
        field1: a.string(),
      }),
      Model135: a.model({
        field1: a.string(),
      }),
      Model136: a.model({
        field1: a.string(),
      }),
      Model137: a.model({
        field1: a.string(),
      }),
      Model138: a.model({
        field1: a.string(),
      }),
      Model139: a.model({
        field1: a.string(),
      }),
      Model140: a.model({
        field1: a.string(),
      }),
      Model141: a.model({
        field1: a.string(),
      }),
      Model142: a.model({
        field1: a.string(),
      }),
      Model143: a.model({
        field1: a.string(),
      }),
      Model144: a.model({
        field1: a.string(),
      }),
      Model145: a.model({
        field1: a.string(),
      }),
      Model146: a.model({
        field1: a.string(),
      }),
      Model147: a.model({
        field1: a.string(),
      }),
      Model148: a.model({
        field1: a.string(),
      }),
      Model149: a.model({
        field1: a.string(),
      }),
      Model150: a.model({
        field1: a.string(),
      }),
      Model151: a.model({
        field1: a.string(),
      }),
      Model152: a.model({
        field1: a.string(),
      }),
      Model153: a.model({
        field1: a.string(),
      }),
      Model154: a.model({
        field1: a.string(),
      }),
      Model155: a.model({
        field1: a.string(),
      }),
      Model156: a.model({
        field1: a.string(),
      }),
      Model157: a.model({
        field1: a.string(),
      }),
      Model158: a.model({
        field1: a.string(),
      }),
      Model159: a.model({
        field1: a.string(),
      }),
      Model160: a.model({
        field1: a.string(),
      }),
      Model161: a.model({
        field1: a.string(),
      }),
      Model162: a.model({
        field1: a.string(),
      }),
      Model163: a.model({
        field1: a.string(),
      }),
      Model164: a.model({
        field1: a.string(),
      }),
      Model165: a.model({
        field1: a.string(),
      }),
      Model166: a.model({
        field1: a.string(),
      }),
      Model167: a.model({
        field1: a.string(),
      }),
      Model168: a.model({
        field1: a.string(),
      }),
      Model169: a.model({
        field1: a.string(),
      }),
      Model170: a.model({
        field1: a.string(),
      }),
      Model171: a.model({
        field1: a.string(),
      }),
      Model172: a.model({
        field1: a.string(),
      }),
      Model173: a.model({
        field1: a.string(),
      }),
      Model174: a.model({
        field1: a.string(),
      }),
      Model175: a.model({
        field1: a.string(),
      }),
      Model176: a.model({
        field1: a.string(),
      }),
      Model177: a.model({
        field1: a.string(),
      }),
      Model178: a.model({
        field1: a.string(),
      }),
      Model179: a.model({
        field1: a.string(),
      }),
      Model180: a.model({
        field1: a.string(),
      }),
      Model181: a.model({
        field1: a.string(),
      }),
      Model182: a.model({
        field1: a.string(),
      }),
      Model183: a.model({
        field1: a.string(),
      }),
      Model184: a.model({
        field1: a.string(),
      }),
      Model185: a.model({
        field1: a.string(),
      }),
      Model186: a.model({
        field1: a.string(),
      }),
      Model187: a.model({
        field1: a.string(),
      }),
      Model188: a.model({
        field1: a.string(),
      }),
      Model189: a.model({
        field1: a.string(),
      }),
      Model190: a.model({
        field1: a.string(),
      }),
      Model191: a.model({
        field1: a.string(),
      }),
      Model192: a.model({
        field1: a.string(),
      }),
      Model193: a.model({
        field1: a.string(),
      }),
      Model194: a.model({
        field1: a.string(),
      }),
      Model195: a.model({
        field1: a.string(),
      }),
      Model196: a.model({
        field1: a.string(),
      }),
      Model197: a.model({
        field1: a.string(),
      }),
      Model198: a.model({
        field1: a.string(),
      }),
      Model199: a.model({
        field1: a.string(),
      }),
      Model200: a.model({
        field1: a.string(),
      }),
      Model201: a.model({
        field1: a.string(),
      }),
      Model202: a.model({
        field1: a.string(),
      }),
      Model203: a.model({
        field1: a.string(),
      }),
      Model204: a.model({
        field1: a.string(),
      }),
      Model205: a.model({
        field1: a.string(),
      }),
      Model206: a.model({
        field1: a.string(),
      }),
      Model207: a.model({
        field1: a.string(),
      }),
      Model208: a.model({
        field1: a.string(),
      }),
      Model209: a.model({
        field1: a.string(),
      }),
      Model210: a.model({
        field1: a.string(),
      }),
      Model211: a.model({
        field1: a.string(),
      }),
      Model212: a.model({
        field1: a.string(),
      }),
      Model213: a.model({
        field1: a.string(),
      }),
      Model214: a.model({
        field1: a.string(),
      }),
      Model215: a.model({
        field1: a.string(),
      }),
      Model216: a.model({
        field1: a.string(),
      }),
      Model217: a.model({
        field1: a.string(),
      }),
      Model218: a.model({
        field1: a.string(),
      }),
      Model219: a.model({
        field1: a.string(),
      }),
      Model220: a.model({
        field1: a.string(),
      }),
      Model221: a.model({
        field1: a.string(),
      }),
      Model222: a.model({
        field1: a.string(),
      }),
      Model223: a.model({
        field1: a.string(),
      }),
      Model224: a.model({
        field1: a.string(),
      }),
      Model225: a.model({
        field1: a.string(),
      }),
      Model226: a.model({
        field1: a.string(),
      }),
      Model227: a.model({
        field1: a.string(),
      }),
      Model228: a.model({
        field1: a.string(),
      }),
      Model229: a.model({
        field1: a.string(),
      }),
      Model230: a.model({
        field1: a.string(),
      }),
      Model231: a.model({
        field1: a.string(),
      }),
      Model232: a.model({
        field1: a.string(),
      }),
      Model233: a.model({
        field1: a.string(),
      }),
      Model234: a.model({
        field1: a.string(),
      }),
      Model235: a.model({
        field1: a.string(),
      }),
      Model236: a.model({
        field1: a.string(),
      }),
      Model237: a.model({
        field1: a.string(),
      }),
      Model238: a.model({
        field1: a.string(),
      }),
      Model239: a.model({
        field1: a.string(),
      }),
      Model240: a.model({
        field1: a.string(),
      }),
      Model241: a.model({
        field1: a.string(),
      }),
      Model242: a.model({
        field1: a.string(),
      }),
      Model243: a.model({
        field1: a.string(),
      }),
      Model244: a.model({
        field1: a.string(),
      }),
      Model245: a.model({
        field1: a.string(),
      }),
      Model246: a.model({
        field1: a.string(),
      }),
      Model247: a.model({
        field1: a.string(),
      }),
      Model248: a.model({
        field1: a.string(),
      }),
      Model249: a.model({
        field1: a.string(),
      }),
      Model250: a.model({
        field1: a.string(),
      }),
      Model251: a.model({
        field1: a.string(),
      }),
      Model252: a.model({
        field1: a.string(),
      }),
      Model253: a.model({
        field1: a.string(),
      }),
      Model254: a.model({
        field1: a.string(),
      }),
      Model255: a.model({
        field1: a.string(),
      }),
      Model256: a.model({
        field1: a.string(),
      }),
      Model257: a.model({
        field1: a.string(),
      }),
      Model258: a.model({
        field1: a.string(),
      }),
      Model259: a.model({
        field1: a.string(),
      }),
      Model260: a.model({
        field1: a.string(),
      }),
      Model261: a.model({
        field1: a.string(),
      }),
      Model262: a.model({
        field1: a.string(),
      }),
      Model263: a.model({
        field1: a.string(),
      }),
      Model264: a.model({
        field1: a.string(),
      }),
      Model265: a.model({
        field1: a.string(),
      }),
      Model266: a.model({
        field1: a.string(),
      }),
      Model267: a.model({
        field1: a.string(),
      }),
      Model268: a.model({
        field1: a.string(),
      }),
      Model269: a.model({
        field1: a.string(),
      }),
      Model270: a.model({
        field1: a.string(),
      }),
      Model271: a.model({
        field1: a.string(),
      }),
      Model272: a.model({
        field1: a.string(),
      }),
      Model273: a.model({
        field1: a.string(),
      }),
      Model274: a.model({
        field1: a.string(),
      }),
      Model275: a.model({
        field1: a.string(),
      }),
      Model276: a.model({
        field1: a.string(),
      }),
      Model277: a.model({
        field1: a.string(),
      }),
      Model278: a.model({
        field1: a.string(),
      }),
      Model279: a.model({
        field1: a.string(),
      }),
      Model280: a.model({
        field1: a.string(),
      }),
      Model281: a.model({
        field1: a.string(),
      }),
      Model282: a.model({
        field1: a.string(),
      }),
      Model283: a.model({
        field1: a.string(),
      }),
      Model284: a.model({
        field1: a.string(),
      }),
      Model285: a.model({
        field1: a.string(),
      }),
      Model286: a.model({
        field1: a.string(),
      }),
      Model287: a.model({
        field1: a.string(),
      }),
      Model288: a.model({
        field1: a.string(),
      }),
      Model289: a.model({
        field1: a.string(),
      }),
      Model290: a.model({
        field1: a.string(),
      }),
      Model291: a.model({
        field1: a.string(),
      }),
      Model292: a.model({
        field1: a.string(),
      }),
      Model293: a.model({
        field1: a.string(),
      }),
      Model294: a.model({
        field1: a.string(),
      }),
      Model295: a.model({
        field1: a.string(),
      }),
      Model296: a.model({
        field1: a.string(),
      }),
      Model297: a.model({
        field1: a.string(),
      }),
      Model298: a.model({
        field1: a.string(),
      }),
      Model299: a.model({
        field1: a.string(),
      }),
      Model300: a.model({
        field1: a.string(),
      }),
      Model301: a.model({
        field1: a.string(),
      }),
      Model302: a.model({
        field1: a.string(),
      }),
      Model303: a.model({
        field1: a.string(),
      }),
      Model304: a.model({
        field1: a.string(),
      }),
      Model305: a.model({
        field1: a.string(),
      }),
      Model306: a.model({
        field1: a.string(),
      }),
      Model307: a.model({
        field1: a.string(),
      }),
      Model308: a.model({
        field1: a.string(),
      }),
      Model309: a.model({
        field1: a.string(),
      }),
      Model310: a.model({
        field1: a.string(),
      }),
      Model311: a.model({
        field1: a.string(),
      }),
      Model312: a.model({
        field1: a.string(),
      }),
      Model313: a.model({
        field1: a.string(),
      }),
      Model314: a.model({
        field1: a.string(),
      }),
      Model315: a.model({
        field1: a.string(),
      }),
      Model316: a.model({
        field1: a.string(),
      }),
      Model317: a.model({
        field1: a.string(),
      }),
      Model318: a.model({
        field1: a.string(),
      }),
      Model319: a.model({
        field1: a.string(),
      }),
      Model320: a.model({
        field1: a.string(),
      }),
      Model321: a.model({
        field1: a.string(),
      }),
      Model322: a.model({
        field1: a.string(),
      }),
      Model323: a.model({
        field1: a.string(),
      }),
      Model324: a.model({
        field1: a.string(),
      }),
      Model325: a.model({
        field1: a.string(),
      }),
      Model326: a.model({
        field1: a.string(),
      }),
      Model327: a.model({
        field1: a.string(),
      }),
      Model328: a.model({
        field1: a.string(),
      }),
      Model329: a.model({
        field1: a.string(),
      }),
      Model330: a.model({
        field1: a.string(),
      }),
      Model331: a.model({
        field1: a.string(),
      }),
      Model332: a.model({
        field1: a.string(),
      }),
      Model333: a.model({
        field1: a.string(),
      }),
      Model334: a.model({
        field1: a.string(),
      }),
      Model335: a.model({
        field1: a.string(),
      }),
      Model336: a.model({
        field1: a.string(),
      }),
      Model337: a.model({
        field1: a.string(),
      }),
      Model338: a.model({
        field1: a.string(),
      }),
      Model339: a.model({
        field1: a.string(),
      }),
      Model340: a.model({
        field1: a.string(),
      }),
      Model341: a.model({
        field1: a.string(),
      }),
      Model342: a.model({
        field1: a.string(),
      }),
      Model343: a.model({
        field1: a.string(),
      }),
      Model344: a.model({
        field1: a.string(),
      }),
      Model345: a.model({
        field1: a.string(),
      }),
      Model346: a.model({
        field1: a.string(),
      }),
      Model347: a.model({
        field1: a.string(),
      }),
      Model348: a.model({
        field1: a.string(),
      }),
      Model349: a.model({
        field1: a.string(),
      }),
      Model350: a.model({
        field1: a.string(),
      }),
      Model351: a.model({
        field1: a.string(),
      }),
      Model352: a.model({
        field1: a.string(),
      }),
      Model353: a.model({
        field1: a.string(),
      }),
      Model354: a.model({
        field1: a.string(),
      }),
      Model355: a.model({
        field1: a.string(),
      }),
      Model356: a.model({
        field1: a.string(),
      }),
      Model357: a.model({
        field1: a.string(),
      }),
      Model358: a.model({
        field1: a.string(),
      }),
      Model359: a.model({
        field1: a.string(),
      }),
      Model360: a.model({
        field1: a.string(),
      }),
      Model361: a.model({
        field1: a.string(),
      }),
      Model362: a.model({
        field1: a.string(),
      }),
      Model363: a.model({
        field1: a.string(),
      }),
      Model364: a.model({
        field1: a.string(),
      }),
      Model365: a.model({
        field1: a.string(),
      }),
      Model366: a.model({
        field1: a.string(),
      }),
      Model367: a.model({
        field1: a.string(),
      }),
      Model368: a.model({
        field1: a.string(),
      }),
      Model369: a.model({
        field1: a.string(),
      }),
      Model370: a.model({
        field1: a.string(),
      }),
      Model371: a.model({
        field1: a.string(),
      }),
      Model372: a.model({
        field1: a.string(),
      }),
      Model373: a.model({
        field1: a.string(),
      }),
      Model374: a.model({
        field1: a.string(),
      }),
      Model375: a.model({
        field1: a.string(),
      }),
      Model376: a.model({
        field1: a.string(),
      }),
      Model377: a.model({
        field1: a.string(),
      }),
      Model378: a.model({
        field1: a.string(),
      }),
      Model379: a.model({
        field1: a.string(),
      }),
      Model380: a.model({
        field1: a.string(),
      }),
      Model381: a.model({
        field1: a.string(),
      }),
      Model382: a.model({
        field1: a.string(),
      }),
      Model383: a.model({
        field1: a.string(),
      }),
      Model384: a.model({
        field1: a.string(),
      }),
      Model385: a.model({
        field1: a.string(),
      }),
      Model386: a.model({
        field1: a.string(),
      }),
      Model387: a.model({
        field1: a.string(),
      }),
      Model388: a.model({
        field1: a.string(),
      }),
      Model389: a.model({
        field1: a.string(),
      }),
      Model390: a.model({
        field1: a.string(),
      }),
      Model391: a.model({
        field1: a.string(),
      }),
      Model392: a.model({
        field1: a.string(),
      }),
      Model393: a.model({
        field1: a.string(),
      }),
      Model394: a.model({
        field1: a.string(),
      }),
      Model395: a.model({
        field1: a.string(),
      }),
      Model396: a.model({
        field1: a.string(),
      }),
      Model397: a.model({
        field1: a.string(),
      }),
      Model398: a.model({
        field1: a.string(),
      }),
      Model399: a.model({
        field1: a.string(),
      }),
      Model400: a.model({
        field1: a.string(),
      }),
      Model401: a.model({
        field1: a.string(),
      }),
      Model402: a.model({
        field1: a.string(),
      }),
      Model403: a.model({
        field1: a.string(),
      }),
      Model404: a.model({
        field1: a.string(),
      }),
      Model405: a.model({
        field1: a.string(),
      }),
      Model406: a.model({
        field1: a.string(),
      }),
      Model407: a.model({
        field1: a.string(),
      }),
      Model408: a.model({
        field1: a.string(),
      }),
      Model409: a.model({
        field1: a.string(),
      }),
      Model410: a.model({
        field1: a.string(),
      }),
      Model411: a.model({
        field1: a.string(),
      }),
      Model412: a.model({
        field1: a.string(),
      }),
      Model413: a.model({
        field1: a.string(),
      }),
      Model414: a.model({
        field1: a.string(),
      }),
      Model415: a.model({
        field1: a.string(),
      }),
      Model416: a.model({
        field1: a.string(),
      }),
      Model417: a.model({
        field1: a.string(),
      }),
      Model418: a.model({
        field1: a.string(),
      }),
      Model419: a.model({
        field1: a.string(),
      }),
      Model420: a.model({
        field1: a.string(),
      }),
      Model421: a.model({
        field1: a.string(),
      }),
      Model422: a.model({
        field1: a.string(),
      }),
      Model423: a.model({
        field1: a.string(),
      }),
      Model424: a.model({
        field1: a.string(),
      }),
      Model425: a.model({
        field1: a.string(),
      }),
      Model426: a.model({
        field1: a.string(),
      }),
      Model427: a.model({
        field1: a.string(),
      }),
      Model428: a.model({
        field1: a.string(),
      }),
      Model429: a.model({
        field1: a.string(),
      }),
      Model430: a.model({
        field1: a.string(),
      }),
      Model431: a.model({
        field1: a.string(),
      }),
      Model432: a.model({
        field1: a.string(),
      }),
      Model433: a.model({
        field1: a.string(),
      }),
      Model434: a.model({
        field1: a.string(),
      }),
      Model435: a.model({
        field1: a.string(),
      }),
      Model436: a.model({
        field1: a.string(),
      }),
      Model437: a.model({
        field1: a.string(),
      }),
      Model438: a.model({
        field1: a.string(),
      }),
      Model439: a.model({
        field1: a.string(),
      }),
      Model440: a.model({
        field1: a.string(),
      }),
      Model441: a.model({
        field1: a.string(),
      }),
      Model442: a.model({
        field1: a.string(),
      }),
      Model443: a.model({
        field1: a.string(),
      }),
      Model444: a.model({
        field1: a.string(),
      }),
      Model445: a.model({
        field1: a.string(),
      }),
      Model446: a.model({
        field1: a.string(),
      }),
      Model447: a.model({
        field1: a.string(),
      }),
      Model448: a.model({
        field1: a.string(),
      }),
      Model449: a.model({
        field1: a.string(),
      }),
      Model450: a.model({
        field1: a.string(),
      }),
      Model451: a.model({
        field1: a.string(),
      }),
      Model452: a.model({
        field1: a.string(),
      }),
      Model453: a.model({
        field1: a.string(),
      }),
      Model454: a.model({
        field1: a.string(),
      }),
      Model455: a.model({
        field1: a.string(),
      }),
      Model456: a.model({
        field1: a.string(),
      }),
      Model457: a.model({
        field1: a.string(),
      }),
      Model458: a.model({
        field1: a.string(),
      }),
      Model459: a.model({
        field1: a.string(),
      }),
      Model460: a.model({
        field1: a.string(),
      }),
      Model461: a.model({
        field1: a.string(),
      }),
      Model462: a.model({
        field1: a.string(),
      }),
      Model463: a.model({
        field1: a.string(),
      }),
      Model464: a.model({
        field1: a.string(),
      }),
      Model465: a.model({
        field1: a.string(),
      }),
      Model466: a.model({
        field1: a.string(),
      }),
      Model467: a.model({
        field1: a.string(),
      }),
      Model468: a.model({
        field1: a.string(),
      }),
      Model469: a.model({
        field1: a.string(),
      }),
      Model470: a.model({
        field1: a.string(),
      }),
      Model471: a.model({
        field1: a.string(),
      }),
      Model472: a.model({
        field1: a.string(),
      }),
      Model473: a.model({
        field1: a.string(),
      }),
      Model474: a.model({
        field1: a.string(),
      }),
      Model475: a.model({
        field1: a.string(),
      }),
      Model476: a.model({
        field1: a.string(),
      }),
      Model477: a.model({
        field1: a.string(),
      }),
      Model478: a.model({
        field1: a.string(),
      }),
      Model479: a.model({
        field1: a.string(),
      }),
      Model480: a.model({
        field1: a.string(),
      }),
      Model481: a.model({
        field1: a.string(),
      }),
      Model482: a.model({
        field1: a.string(),
      }),
      Model483: a.model({
        field1: a.string(),
      }),
      Model484: a.model({
        field1: a.string(),
      }),
      Model485: a.model({
        field1: a.string(),
      }),
      Model486: a.model({
        field1: a.string(),
      }),
      Model487: a.model({
        field1: a.string(),
      }),
      Model488: a.model({
        field1: a.string(),
      }),
      Model489: a.model({
        field1: a.string(),
      }),
      Model490: a.model({
        field1: a.string(),
      }),
      Model491: a.model({
        field1: a.string(),
      }),
      Model492: a.model({
        field1: a.string(),
      }),
      Model493: a.model({
        field1: a.string(),
      }),
      Model494: a.model({
        field1: a.string(),
      }),
      Model495: a.model({
        field1: a.string(),
      }),
      Model496: a.model({
        field1: a.string(),
      }),
      Model497: a.model({
        field1: a.string(),
      }),
      Model498: a.model({
        field1: a.string(),
      }),
      Model499: a.model({
        field1: a.string(),
      }),
      Model500: a.model({
        field1: a.string(),
      }),
      Model501: a.model({
        field1: a.string(),
      }),
      Model502: a.model({
        field1: a.string(),
      }),
      Model503: a.model({
        field1: a.string(),
      }),
      Model504: a.model({
        field1: a.string(),
      }),
      Model505: a.model({
        field1: a.string(),
      }),
      Model506: a.model({
        field1: a.string(),
      }),
      Model507: a.model({
        field1: a.string(),
      }),
      Model508: a.model({
        field1: a.string(),
      }),
      Model509: a.model({
        field1: a.string(),
      }),
      Model510: a.model({
        field1: a.string(),
      }),
      Model511: a.model({
        field1: a.string(),
      }),
      Model512: a.model({
        field1: a.string(),
      }),
      Model513: a.model({
        field1: a.string(),
      }),
      Model514: a.model({
        field1: a.string(),
      }),
      Model515: a.model({
        field1: a.string(),
      }),
      Model516: a.model({
        field1: a.string(),
      }),
      Model517: a.model({
        field1: a.string(),
      }),
      Model518: a.model({
        field1: a.string(),
      }),
      Model519: a.model({
        field1: a.string(),
      }),
      Model520: a.model({
        field1: a.string(),
      }),
      Model521: a.model({
        field1: a.string(),
      }),
      Model522: a.model({
        field1: a.string(),
      }),
      Model523: a.model({
        field1: a.string(),
      }),
      Model524: a.model({
        field1: a.string(),
      }),
      Model525: a.model({
        field1: a.string(),
      }),
      Model526: a.model({
        field1: a.string(),
      }),
      Model527: a.model({
        field1: a.string(),
      }),
      Model528: a.model({
        field1: a.string(),
      }),
      Model529: a.model({
        field1: a.string(),
      }),
      Model530: a.model({
        field1: a.string(),
      }),
      Model531: a.model({
        field1: a.string(),
      }),
      Model532: a.model({
        field1: a.string(),
      }),
      Model533: a.model({
        field1: a.string(),
      }),
      Model534: a.model({
        field1: a.string(),
      }),
      Model535: a.model({
        field1: a.string(),
      }),
      Model536: a.model({
        field1: a.string(),
      }),
      Model537: a.model({
        field1: a.string(),
      }),
      Model538: a.model({
        field1: a.string(),
      }),
      Model539: a.model({
        field1: a.string(),
      }),
      Model540: a.model({
        field1: a.string(),
      }),
      Model541: a.model({
        field1: a.string(),
      }),
      Model542: a.model({
        field1: a.string(),
      }),
      Model543: a.model({
        field1: a.string(),
      }),
      Model544: a.model({
        field1: a.string(),
      }),
      Model545: a.model({
        field1: a.string(),
      }),
      Model546: a.model({
        field1: a.string(),
      }),
      Model547: a.model({
        field1: a.string(),
      }),
      Model548: a.model({
        field1: a.string(),
      }),
      Model549: a.model({
        field1: a.string(),
      }),
      Model550: a.model({
        field1: a.string(),
      }),
      Model551: a.model({
        field1: a.string(),
      }),
      Model552: a.model({
        field1: a.string(),
      }),
      Model553: a.model({
        field1: a.string(),
      }),
      Model554: a.model({
        field1: a.string(),
      }),
      Model555: a.model({
        field1: a.string(),
      }),
      Model556: a.model({
        field1: a.string(),
      }),
      Model557: a.model({
        field1: a.string(),
      }),
      Model558: a.model({
        field1: a.string(),
      }),
      Model559: a.model({
        field1: a.string(),
      }),
      Model560: a.model({
        field1: a.string(),
      }),
      Model561: a.model({
        field1: a.string(),
      }),
      Model562: a.model({
        field1: a.string(),
      }),
      Model563: a.model({
        field1: a.string(),
      }),
      Model564: a.model({
        field1: a.string(),
      }),
      Model565: a.model({
        field1: a.string(),
      }),
      Model566: a.model({
        field1: a.string(),
      }),
      Model567: a.model({
        field1: a.string(),
      }),
      Model568: a.model({
        field1: a.string(),
      }),
      Model569: a.model({
        field1: a.string(),
      }),
      Model570: a.model({
        field1: a.string(),
      }),
      Model571: a.model({
        field1: a.string(),
      }),
      Model572: a.model({
        field1: a.string(),
      }),
      Model573: a.model({
        field1: a.string(),
      }),
      Model574: a.model({
        field1: a.string(),
      }),
      Model575: a.model({
        field1: a.string(),
      }),
      Model576: a.model({
        field1: a.string(),
      }),
      Model577: a.model({
        field1: a.string(),
      }),
      Model578: a.model({
        field1: a.string(),
      }),
      Model579: a.model({
        field1: a.string(),
      }),
      Model580: a.model({
        field1: a.string(),
      }),
      Model581: a.model({
        field1: a.string(),
      }),
      Model582: a.model({
        field1: a.string(),
      }),
      Model583: a.model({
        field1: a.string(),
      }),
      Model584: a.model({
        field1: a.string(),
      }),
      Model585: a.model({
        field1: a.string(),
      }),
      Model586: a.model({
        field1: a.string(),
      }),
      Model587: a.model({
        field1: a.string(),
      }),
      Model588: a.model({
        field1: a.string(),
      }),
      Model589: a.model({
        field1: a.string(),
      }),
      Model590: a.model({
        field1: a.string(),
      }),
      Model591: a.model({
        field1: a.string(),
      }),
      Model592: a.model({
        field1: a.string(),
      }),
      Model593: a.model({
        field1: a.string(),
      }),
      Model594: a.model({
        field1: a.string(),
      }),
      Model595: a.model({
        field1: a.string(),
      }),
      Model596: a.model({
        field1: a.string(),
      }),
      Model597: a.model({
        field1: a.string(),
      }),
      Model598: a.model({
        field1: a.string(),
      }),
      Model599: a.model({
        field1: a.string(),
      }),
      Model600: a.model({
        field1: a.string(),
      }),
      Model601: a.model({
        field1: a.string(),
      }),
      Model602: a.model({
        field1: a.string(),
      }),
      Model603: a.model({
        field1: a.string(),
      }),
      Model604: a.model({
        field1: a.string(),
      }),
      Model605: a.model({
        field1: a.string(),
      }),
      Model606: a.model({
        field1: a.string(),
      }),
      Model607: a.model({
        field1: a.string(),
      }),
      Model608: a.model({
        field1: a.string(),
      }),
      Model609: a.model({
        field1: a.string(),
      }),
      Model610: a.model({
        field1: a.string(),
      }),
      Model611: a.model({
        field1: a.string(),
      }),
      Model612: a.model({
        field1: a.string(),
      }),
      Model613: a.model({
        field1: a.string(),
      }),
      Model614: a.model({
        field1: a.string(),
      }),
      Model615: a.model({
        field1: a.string(),
      }),
      Model616: a.model({
        field1: a.string(),
      }),
      Model617: a.model({
        field1: a.string(),
      }),
      Model618: a.model({
        field1: a.string(),
      }),
      Model619: a.model({
        field1: a.string(),
      }),
      Model620: a.model({
        field1: a.string(),
      }),
      Model621: a.model({
        field1: a.string(),
      }),
      Model622: a.model({
        field1: a.string(),
      }),
      Model623: a.model({
        field1: a.string(),
      }),
      Model624: a.model({
        field1: a.string(),
      }),
      Model625: a.model({
        field1: a.string(),
      }),
      Model626: a.model({
        field1: a.string(),
      }),
      Model627: a.model({
        field1: a.string(),
      }),
      Model628: a.model({
        field1: a.string(),
      }),
      Model629: a.model({
        field1: a.string(),
      }),
      Model630: a.model({
        field1: a.string(),
      }),
      Model631: a.model({
        field1: a.string(),
      }),
      Model632: a.model({
        field1: a.string(),
      }),
      Model633: a.model({
        field1: a.string(),
      }),
      Model634: a.model({
        field1: a.string(),
      }),
      Model635: a.model({
        field1: a.string(),
      }),
      Model636: a.model({
        field1: a.string(),
      }),
      Model637: a.model({
        field1: a.string(),
      }),
      Model638: a.model({
        field1: a.string(),
      }),
      Model639: a.model({
        field1: a.string(),
      }),
      Model640: a.model({
        field1: a.string(),
      }),
      Model641: a.model({
        field1: a.string(),
      }),
      Model642: a.model({
        field1: a.string(),
      }),
      Model643: a.model({
        field1: a.string(),
      }),
      Model644: a.model({
        field1: a.string(),
      }),
      Model645: a.model({
        field1: a.string(),
      }),
      Model646: a.model({
        field1: a.string(),
      }),
      Model647: a.model({
        field1: a.string(),
      }),
      Model648: a.model({
        field1: a.string(),
      }),
      Model649: a.model({
        field1: a.string(),
      }),
      Model650: a.model({
        field1: a.string(),
      }),
      Model651: a.model({
        field1: a.string(),
      }),
      Model652: a.model({
        field1: a.string(),
      }),
      Model653: a.model({
        field1: a.string(),
      }),
      Model654: a.model({
        field1: a.string(),
      }),
      Model655: a.model({
        field1: a.string(),
      }),
      Model656: a.model({
        field1: a.string(),
      }),
      Model657: a.model({
        field1: a.string(),
      }),
      Model658: a.model({
        field1: a.string(),
      }),
      Model659: a.model({
        field1: a.string(),
      }),
      Model660: a.model({
        field1: a.string(),
      }),
      Model661: a.model({
        field1: a.string(),
      }),
      Model662: a.model({
        field1: a.string(),
      }),
      Model663: a.model({
        field1: a.string(),
      }),
      Model664: a.model({
        field1: a.string(),
      }),
      Model665: a.model({
        field1: a.string(),
      }),
      Model666: a.model({
        field1: a.string(),
      }),
      Model667: a.model({
        field1: a.string(),
      }),
      Model668: a.model({
        field1: a.string(),
      }),
      Model669: a.model({
        field1: a.string(),
      }),
      Model670: a.model({
        field1: a.string(),
      }),
      Model671: a.model({
        field1: a.string(),
      }),
      Model672: a.model({
        field1: a.string(),
      }),
      Model673: a.model({
        field1: a.string(),
      }),
      Model674: a.model({
        field1: a.string(),
      }),
      Model675: a.model({
        field1: a.string(),
      }),
      Model676: a.model({
        field1: a.string(),
      }),
      Model677: a.model({
        field1: a.string(),
      }),
      Model678: a.model({
        field1: a.string(),
      }),
      Model679: a.model({
        field1: a.string(),
      }),
      Model680: a.model({
        field1: a.string(),
      }),
      Model681: a.model({
        field1: a.string(),
      }),
      Model682: a.model({
        field1: a.string(),
      }),
      Model683: a.model({
        field1: a.string(),
      }),
      Model684: a.model({
        field1: a.string(),
      }),
      Model685: a.model({
        field1: a.string(),
      }),
      Model686: a.model({
        field1: a.string(),
      }),
      Model687: a.model({
        field1: a.string(),
      }),
      Model688: a.model({
        field1: a.string(),
      }),
      Model689: a.model({
        field1: a.string(),
      }),
      Model690: a.model({
        field1: a.string(),
      }),
      Model691: a.model({
        field1: a.string(),
      }),
      Model692: a.model({
        field1: a.string(),
      }),
      Model693: a.model({
        field1: a.string(),
      }),
      Model694: a.model({
        field1: a.string(),
      }),
      Model695: a.model({
        field1: a.string(),
      }),
      Model696: a.model({
        field1: a.string(),
      }),
      Model697: a.model({
        field1: a.string(),
      }),
      Model698: a.model({
        field1: a.string(),
      }),
      Model699: a.model({
        field1: a.string(),
      }),
      Model700: a.model({
        field1: a.string(),
      }),
      Model701: a.model({
        field1: a.string(),
      }),
      Model702: a.model({
        field1: a.string(),
      }),
      Model703: a.model({
        field1: a.string(),
      }),
      Model704: a.model({
        field1: a.string(),
      }),
      Model705: a.model({
        field1: a.string(),
      }),
      Model706: a.model({
        field1: a.string(),
      }),
      Model707: a.model({
        field1: a.string(),
      }),
      Model708: a.model({
        field1: a.string(),
      }),
      Model709: a.model({
        field1: a.string(),
      }),
      Model710: a.model({
        field1: a.string(),
      }),
      Model711: a.model({
        field1: a.string(),
      }),
      Model712: a.model({
        field1: a.string(),
      }),
      Model713: a.model({
        field1: a.string(),
      }),
      Model714: a.model({
        field1: a.string(),
      }),
      Model715: a.model({
        field1: a.string(),
      }),
      Model716: a.model({
        field1: a.string(),
      }),
      Model717: a.model({
        field1: a.string(),
      }),
      Model718: a.model({
        field1: a.string(),
      }),
      Model719: a.model({
        field1: a.string(),
      }),
      Model720: a.model({
        field1: a.string(),
      }),
      Model721: a.model({
        field1: a.string(),
      }),
      Model722: a.model({
        field1: a.string(),
      }),
      Model723: a.model({
        field1: a.string(),
      }),
      Model724: a.model({
        field1: a.string(),
      }),
      Model725: a.model({
        field1: a.string(),
      }),
      Model726: a.model({
        field1: a.string(),
      }),
      Model727: a.model({
        field1: a.string(),
      }),
      Model728: a.model({
        field1: a.string(),
      }),
      Model729: a.model({
        field1: a.string(),
      }),
      Model730: a.model({
        field1: a.string(),
      }),
      Model731: a.model({
        field1: a.string(),
      }),
      Model732: a.model({
        field1: a.string(),
      }),
      Model733: a.model({
        field1: a.string(),
      }),
      Model734: a.model({
        field1: a.string(),
      }),
      Model735: a.model({
        field1: a.string(),
      }),
      Model736: a.model({
        field1: a.string(),
      }),
      Model737: a.model({
        field1: a.string(),
      }),
      Model738: a.model({
        field1: a.string(),
      }),
      Model739: a.model({
        field1: a.string(),
      }),
      Model740: a.model({
        field1: a.string(),
      }),
      Model741: a.model({
        field1: a.string(),
      }),
      Model742: a.model({
        field1: a.string(),
      }),
      Model743: a.model({
        field1: a.string(),
      }),
      Model744: a.model({
        field1: a.string(),
      }),
      Model745: a.model({
        field1: a.string(),
      }),
      Model746: a.model({
        field1: a.string(),
      }),
      Model747: a.model({
        field1: a.string(),
      }),
      Model748: a.model({
        field1: a.string(),
      }),
      Model749: a.model({
        field1: a.string(),
      }),
      Model750: a.model({
        field1: a.string(),
      }),
      Model751: a.model({
        field1: a.string(),
      }),
      Model752: a.model({
        field1: a.string(),
      }),
      Model753: a.model({
        field1: a.string(),
      }),
      Model754: a.model({
        field1: a.string(),
      }),
      Model755: a.model({
        field1: a.string(),
      }),
      Model756: a.model({
        field1: a.string(),
      }),
      Model757: a.model({
        field1: a.string(),
      }),
      Model758: a.model({
        field1: a.string(),
      }),
      Model759: a.model({
        field1: a.string(),
      }),
      Model760: a.model({
        field1: a.string(),
      }),
      Model761: a.model({
        field1: a.string(),
      }),
      Model762: a.model({
        field1: a.string(),
      }),
      Model763: a.model({
        field1: a.string(),
      }),
      Model764: a.model({
        field1: a.string(),
      }),
      Model765: a.model({
        field1: a.string(),
      }),
      Model766: a.model({
        field1: a.string(),
      }),
      Model767: a.model({
        field1: a.string(),
      }),
      Model768: a.model({
        field1: a.string(),
      }),
      Model769: a.model({
        field1: a.string(),
      }),
      Model770: a.model({
        field1: a.string(),
      }),
      Model771: a.model({
        field1: a.string(),
      }),
      Model772: a.model({
        field1: a.string(),
      }),
      Model773: a.model({
        field1: a.string(),
      }),
      Model774: a.model({
        field1: a.string(),
      }),
      Model775: a.model({
        field1: a.string(),
      }),
      Model776: a.model({
        field1: a.string(),
      }),
      Model777: a.model({
        field1: a.string(),
      }),
      Model778: a.model({
        field1: a.string(),
      }),
      Model779: a.model({
        field1: a.string(),
      }),
      Model780: a.model({
        field1: a.string(),
      }),
      Model781: a.model({
        field1: a.string(),
      }),
      Model782: a.model({
        field1: a.string(),
      }),
      Model783: a.model({
        field1: a.string(),
      }),
      Model784: a.model({
        field1: a.string(),
      }),
      Model785: a.model({
        field1: a.string(),
      }),
      Model786: a.model({
        field1: a.string(),
      }),
      Model787: a.model({
        field1: a.string(),
      }),
      Model788: a.model({
        field1: a.string(),
      }),
      Model789: a.model({
        field1: a.string(),
      }),
      Model790: a.model({
        field1: a.string(),
      }),
      Model791: a.model({
        field1: a.string(),
      }),
      Model792: a.model({
        field1: a.string(),
      }),
      Model793: a.model({
        field1: a.string(),
      }),
      Model794: a.model({
        field1: a.string(),
      }),
      Model795: a.model({
        field1: a.string(),
      }),
      Model796: a.model({
        field1: a.string(),
      }),
      Model797: a.model({
        field1: a.string(),
      }),
      Model798: a.model({
        field1: a.string(),
      }),
      Model799: a.model({
        field1: a.string(),
      }),
      Model800: a.model({
        field1: a.string(),
      }),
      Model801: a.model({
        field1: a.string(),
      }),
      Model802: a.model({
        field1: a.string(),
      }),
      Model803: a.model({
        field1: a.string(),
      }),
      Model804: a.model({
        field1: a.string(),
      }),
      Model805: a.model({
        field1: a.string(),
      }),
      Model806: a.model({
        field1: a.string(),
      }),
      Model807: a.model({
        field1: a.string(),
      }),
      Model808: a.model({
        field1: a.string(),
      }),
      Model809: a.model({
        field1: a.string(),
      }),
      Model810: a.model({
        field1: a.string(),
      }),
      Model811: a.model({
        field1: a.string(),
      }),
      Model812: a.model({
        field1: a.string(),
      }),
      Model813: a.model({
        field1: a.string(),
      }),
      Model814: a.model({
        field1: a.string(),
      }),
      Model815: a.model({
        field1: a.string(),
      }),
      Model816: a.model({
        field1: a.string(),
      }),
      Model817: a.model({
        field1: a.string(),
      }),
      Model818: a.model({
        field1: a.string(),
      }),
      Model819: a.model({
        field1: a.string(),
      }),
      Model820: a.model({
        field1: a.string(),
      }),
      Model821: a.model({
        field1: a.string(),
      }),
      Model822: a.model({
        field1: a.string(),
      }),
      Model823: a.model({
        field1: a.string(),
      }),
      Model824: a.model({
        field1: a.string(),
      }),
      Model825: a.model({
        field1: a.string(),
      }),
      Model826: a.model({
        field1: a.string(),
      }),
      Model827: a.model({
        field1: a.string(),
      }),
      Model828: a.model({
        field1: a.string(),
      }),
      Model829: a.model({
        field1: a.string(),
      }),
      Model830: a.model({
        field1: a.string(),
      }),
      Model831: a.model({
        field1: a.string(),
      }),
      Model832: a.model({
        field1: a.string(),
      }),
      Model833: a.model({
        field1: a.string(),
      }),
      Model834: a.model({
        field1: a.string(),
      }),
      Model835: a.model({
        field1: a.string(),
      }),
      Model836: a.model({
        field1: a.string(),
      }),
      Model837: a.model({
        field1: a.string(),
      }),
      Model838: a.model({
        field1: a.string(),
      }),
      Model839: a.model({
        field1: a.string(),
      }),
      Model840: a.model({
        field1: a.string(),
      }),
      Model841: a.model({
        field1: a.string(),
      }),
      Model842: a.model({
        field1: a.string(),
      }),
      Model843: a.model({
        field1: a.string(),
      }),
      Model844: a.model({
        field1: a.string(),
      }),
      Model845: a.model({
        field1: a.string(),
      }),
      Model846: a.model({
        field1: a.string(),
      }),
      Model847: a.model({
        field1: a.string(),
      }),
      Model848: a.model({
        field1: a.string(),
      }),
      Model849: a.model({
        field1: a.string(),
      }),
      Model850: a.model({
        field1: a.string(),
      }),
      Model851: a.model({
        field1: a.string(),
      }),
      Model852: a.model({
        field1: a.string(),
      }),
      Model853: a.model({
        field1: a.string(),
      }),
      Model854: a.model({
        field1: a.string(),
      }),
      Model855: a.model({
        field1: a.string(),
      }),
      Model856: a.model({
        field1: a.string(),
      }),
      Model857: a.model({
        field1: a.string(),
      }),
      Model858: a.model({
        field1: a.string(),
      }),
      Model859: a.model({
        field1: a.string(),
      }),
      Model860: a.model({
        field1: a.string(),
      }),
      Model861: a.model({
        field1: a.string(),
      }),
      Model862: a.model({
        field1: a.string(),
      }),
      Model863: a.model({
        field1: a.string(),
      }),
      Model864: a.model({
        field1: a.string(),
      }),
      Model865: a.model({
        field1: a.string(),
      }),
      Model866: a.model({
        field1: a.string(),
      }),
      Model867: a.model({
        field1: a.string(),
      }),
      Model868: a.model({
        field1: a.string(),
      }),
      Model869: a.model({
        field1: a.string(),
      }),
      Model870: a.model({
        field1: a.string(),
      }),
      Model871: a.model({
        field1: a.string(),
      }),
      Model872: a.model({
        field1: a.string(),
      }),
      Model873: a.model({
        field1: a.string(),
      }),
      Model874: a.model({
        field1: a.string(),
      }),
      Model875: a.model({
        field1: a.string(),
      }),
      Model876: a.model({
        field1: a.string(),
      }),
      Model877: a.model({
        field1: a.string(),
      }),
      Model878: a.model({
        field1: a.string(),
      }),
      Model879: a.model({
        field1: a.string(),
      }),
      Model880: a.model({
        field1: a.string(),
      }),
      Model881: a.model({
        field1: a.string(),
      }),
      Model882: a.model({
        field1: a.string(),
      }),
      Model883: a.model({
        field1: a.string(),
      }),
      Model884: a.model({
        field1: a.string(),
      }),
      Model885: a.model({
        field1: a.string(),
      }),
      Model886: a.model({
        field1: a.string(),
      }),
      Model887: a.model({
        field1: a.string(),
      }),
      Model888: a.model({
        field1: a.string(),
      }),
      Model889: a.model({
        field1: a.string(),
      }),
      Model890: a.model({
        field1: a.string(),
      }),
      Model891: a.model({
        field1: a.string(),
      }),
      Model892: a.model({
        field1: a.string(),
      }),
      Model893: a.model({
        field1: a.string(),
      }),
      Model894: a.model({
        field1: a.string(),
      }),
      Model895: a.model({
        field1: a.string(),
      }),
      Model896: a.model({
        field1: a.string(),
      }),
      Model897: a.model({
        field1: a.string(),
      }),
      Model898: a.model({
        field1: a.string(),
      }),
      Model899: a.model({
        field1: a.string(),
      }),
      Model900: a.model({
        field1: a.string(),
      }),
      Model901: a.model({
        field1: a.string(),
      }),
      Model902: a.model({
        field1: a.string(),
      }),
      Model903: a.model({
        field1: a.string(),
      }),
      Model904: a.model({
        field1: a.string(),
      }),
      Model905: a.model({
        field1: a.string(),
      }),
      Model906: a.model({
        field1: a.string(),
      }),
      Model907: a.model({
        field1: a.string(),
      }),
      Model908: a.model({
        field1: a.string(),
      }),
      Model909: a.model({
        field1: a.string(),
      }),
      Model910: a.model({
        field1: a.string(),
      }),
      Model911: a.model({
        field1: a.string(),
      }),
      Model912: a.model({
        field1: a.string(),
      }),
      Model913: a.model({
        field1: a.string(),
      }),
      Model914: a.model({
        field1: a.string(),
      }),
      Model915: a.model({
        field1: a.string(),
      }),
      Model916: a.model({
        field1: a.string(),
      }),
      Model917: a.model({
        field1: a.string(),
      }),
      Model918: a.model({
        field1: a.string(),
      }),
      Model919: a.model({
        field1: a.string(),
      }),
      Model920: a.model({
        field1: a.string(),
      }),
      Model921: a.model({
        field1: a.string(),
      }),
      Model922: a.model({
        field1: a.string(),
      }),
      Model923: a.model({
        field1: a.string(),
      }),
      Model924: a.model({
        field1: a.string(),
      }),
      Model925: a.model({
        field1: a.string(),
      }),
      Model926: a.model({
        field1: a.string(),
      }),
      Model927: a.model({
        field1: a.string(),
      }),
      Model928: a.model({
        field1: a.string(),
      }),
      Model929: a.model({
        field1: a.string(),
      }),
      Model930: a.model({
        field1: a.string(),
      }),
      Model931: a.model({
        field1: a.string(),
      }),
      Model932: a.model({
        field1: a.string(),
      }),
      Model933: a.model({
        field1: a.string(),
      }),
      Model934: a.model({
        field1: a.string(),
      }),
      Model935: a.model({
        field1: a.string(),
      }),
      Model936: a.model({
        field1: a.string(),
      }),
      Model937: a.model({
        field1: a.string(),
      }),
      Model938: a.model({
        field1: a.string(),
      }),
      Model939: a.model({
        field1: a.string(),
      }),
      Model940: a.model({
        field1: a.string(),
      }),
      Model941: a.model({
        field1: a.string(),
      }),
      Model942: a.model({
        field1: a.string(),
      }),
      Model943: a.model({
        field1: a.string(),
      }),
      Model944: a.model({
        field1: a.string(),
      }),
      Model945: a.model({
        field1: a.string(),
      }),
      Model946: a.model({
        field1: a.string(),
      }),
      Model947: a.model({
        field1: a.string(),
      }),
      Model948: a.model({
        field1: a.string(),
      }),
      Model949: a.model({
        field1: a.string(),
      }),
      Model950: a.model({
        field1: a.string(),
      }),
      Model951: a.model({
        field1: a.string(),
      }),
      Model952: a.model({
        field1: a.string(),
      }),
      Model953: a.model({
        field1: a.string(),
      }),
      Model954: a.model({
        field1: a.string(),
      }),
      Model955: a.model({
        field1: a.string(),
      }),
      Model956: a.model({
        field1: a.string(),
      }),
      Model957: a.model({
        field1: a.string(),
      }),
      Model958: a.model({
        field1: a.string(),
      }),
      Model959: a.model({
        field1: a.string(),
      }),
      Model960: a.model({
        field1: a.string(),
      }),
      Model961: a.model({
        field1: a.string(),
      }),
      Model962: a.model({
        field1: a.string(),
      }),
      Model963: a.model({
        field1: a.string(),
      }),
      Model964: a.model({
        field1: a.string(),
      }),
      Model965: a.model({
        field1: a.string(),
      }),
      Model966: a.model({
        field1: a.string(),
      }),
      Model967: a.model({
        field1: a.string(),
      }),
      Model968: a.model({
        field1: a.string(),
      }),
      Model969: a.model({
        field1: a.string(),
      }),
      Model970: a.model({
        field1: a.string(),
      }),
      Model971: a.model({
        field1: a.string(),
      }),
      Model972: a.model({
        field1: a.string(),
      }),
      Model973: a.model({
        field1: a.string(),
      }),
      Model974: a.model({
        field1: a.string(),
      }),
      Model975: a.model({
        field1: a.string(),
      }),
      Model976: a.model({
        field1: a.string(),
      }),
      Model977: a.model({
        field1: a.string(),
      }),
      Model978: a.model({
        field1: a.string(),
      }),
      Model979: a.model({
        field1: a.string(),
      }),
      Model980: a.model({
        field1: a.string(),
      }),
      Model981: a.model({
        field1: a.string(),
      }),
      Model982: a.model({
        field1: a.string(),
      }),
      Model983: a.model({
        field1: a.string(),
      }),
      Model984: a.model({
        field1: a.string(),
      }),
      Model985: a.model({
        field1: a.string(),
      }),
      Model986: a.model({
        field1: a.string(),
      }),
      Model987: a.model({
        field1: a.string(),
      }),
      Model988: a.model({
        field1: a.string(),
      }),
      Model989: a.model({
        field1: a.string(),
      }),
      Model990: a.model({
        field1: a.string(),
      }),
      Model991: a.model({
        field1: a.string(),
      }),
      Model992: a.model({
        field1: a.string(),
      }),
      Model993: a.model({
        field1: a.string(),
      }),
      Model994: a.model({
        field1: a.string(),
      }),
      Model995: a.model({
        field1: a.string(),
      }),
      Model996: a.model({
        field1: a.string(),
      }),
      Model997: a.model({
        field1: a.string(),
      }),
      Model998: a.model({
        field1: a.string(),
      }),
      Model999: a.model({
        field1: a.string(),
      }),
      Model1000: a.model({
        field1: a.string(),
      }),
      Model1001: a.model({
        field1: a.string(),
      }),
      Model1002: a.model({
        field1: a.string(),
      }),
      Model1003: a.model({
        field1: a.string(),
      }),
      Model1004: a.model({
        field1: a.string(),
      }),
      Model1005: a.model({
        field1: a.string(),
      }),
      Model1006: a.model({
        field1: a.string(),
      }),
      Model1007: a.model({
        field1: a.string(),
      }),
      Model1008: a.model({
        field1: a.string(),
      }),
      Model1009: a.model({
        field1: a.string(),
      }),
      Model1010: a.model({
        field1: a.string(),
      }),
      Model1011: a.model({
        field1: a.string(),
      }),
      Model1012: a.model({
        field1: a.string(),
      }),
      Model1013: a.model({
        field1: a.string(),
      }),
      Model1014: a.model({
        field1: a.string(),
      }),
      Model1015: a.model({
        field1: a.string(),
      }),
      Model1016: a.model({
        field1: a.string(),
      }),
      Model1017: a.model({
        field1: a.string(),
      }),
      Model1018: a.model({
        field1: a.string(),
      }),
      Model1019: a.model({
        field1: a.string(),
      }),
      Model1020: a.model({
        field1: a.string(),
      }),
      Model1021: a.model({
        field1: a.string(),
      }),
      Model1022: a.model({
        field1: a.string(),
      }),
      Model1023: a.model({
        field1: a.string(),
      }),
      Model1024: a.model({
        field1: a.string(),
      }),
      Model1025: a.model({
        field1: a.string(),
      }),
      Model1026: a.model({
        field1: a.string(),
      }),
      Model1027: a.model({
        field1: a.string(),
      }),
      Model1028: a.model({
        field1: a.string(),
      }),
      Model1029: a.model({
        field1: a.string(),
      }),
      Model1030: a.model({
        field1: a.string(),
      }),
      Model1031: a.model({
        field1: a.string(),
      }),
      Model1032: a.model({
        field1: a.string(),
      }),
      Model1033: a.model({
        field1: a.string(),
      }),
      Model1034: a.model({
        field1: a.string(),
      }),
      Model1035: a.model({
        field1: a.string(),
      }),
      Model1036: a.model({
        field1: a.string(),
      }),
      Model1037: a.model({
        field1: a.string(),
      }),
      Model1038: a.model({
        field1: a.string(),
      }),
      Model1039: a.model({
        field1: a.string(),
      }),
      Model1040: a.model({
        field1: a.string(),
      }),
      Model1041: a.model({
        field1: a.string(),
      }),
      Model1042: a.model({
        field1: a.string(),
      }),
      Model1043: a.model({
        field1: a.string(),
      }),
      Model1044: a.model({
        field1: a.string(),
      }),
      Model1045: a.model({
        field1: a.string(),
      }),
      Model1046: a.model({
        field1: a.string(),
      }),
      Model1047: a.model({
        field1: a.string(),
      }),
      Model1048: a.model({
        field1: a.string(),
      }),
      Model1049: a.model({
        field1: a.string(),
      }),
      Model1050: a.model({
        field1: a.string(),
      }),
      Model1051: a.model({
        field1: a.string(),
      }),
      Model1052: a.model({
        field1: a.string(),
      }),
      Model1053: a.model({
        field1: a.string(),
      }),
      Model1054: a.model({
        field1: a.string(),
      }),
      Model1055: a.model({
        field1: a.string(),
      }),
      Model1056: a.model({
        field1: a.string(),
      }),
      Model1057: a.model({
        field1: a.string(),
      }),
      Model1058: a.model({
        field1: a.string(),
      }),
      Model1059: a.model({
        field1: a.string(),
      }),
      Model1060: a.model({
        field1: a.string(),
      }),
      Model1061: a.model({
        field1: a.string(),
      }),
      Model1062: a.model({
        field1: a.string(),
      }),
      Model1063: a.model({
        field1: a.string(),
      }),
      Model1064: a.model({
        field1: a.string(),
      }),
      Model1065: a.model({
        field1: a.string(),
      }),
      Model1066: a.model({
        field1: a.string(),
      }),
      Model1067: a.model({
        field1: a.string(),
      }),
      Model1068: a.model({
        field1: a.string(),
      }),
      Model1069: a.model({
        field1: a.string(),
      }),
      Model1070: a.model({
        field1: a.string(),
      }),
      Model1071: a.model({
        field1: a.string(),
      }),
      Model1072: a.model({
        field1: a.string(),
      }),
      Model1073: a.model({
        field1: a.string(),
      }),
      Model1074: a.model({
        field1: a.string(),
      }),
      Model1075: a.model({
        field1: a.string(),
      }),
      Model1076: a.model({
        field1: a.string(),
      }),
      Model1077: a.model({
        field1: a.string(),
      }),
      Model1078: a.model({
        field1: a.string(),
      }),
      Model1079: a.model({
        field1: a.string(),
      }),
      Model1080: a.model({
        field1: a.string(),
      }),
      Model1081: a.model({
        field1: a.string(),
      }),
      Model1082: a.model({
        field1: a.string(),
      }),
      Model1083: a.model({
        field1: a.string(),
      }),
      Model1084: a.model({
        field1: a.string(),
      }),
      Model1085: a.model({
        field1: a.string(),
      }),
      Model1086: a.model({
        field1: a.string(),
      }),
      Model1087: a.model({
        field1: a.string(),
      }),
      Model1088: a.model({
        field1: a.string(),
      }),
      Model1089: a.model({
        field1: a.string(),
      }),
      Model1090: a.model({
        field1: a.string(),
      }),
      Model1091: a.model({
        field1: a.string(),
      }),
      Model1092: a.model({
        field1: a.string(),
      }),
      Model1093: a.model({
        field1: a.string(),
      }),
      Model1094: a.model({
        field1: a.string(),
      }),
      Model1095: a.model({
        field1: a.string(),
      }),
      Model1096: a.model({
        field1: a.string(),
      }),
      Model1097: a.model({
        field1: a.string(),
      }),
      Model1098: a.model({
        field1: a.string(),
      }),
      Model1099: a.model({
        field1: a.string(),
      }),
      Model1100: a.model({
        field1: a.string(),
      }),
      Model1101: a.model({
        field1: a.string(),
      }),
      Model1102: a.model({
        field1: a.string(),
      }),
      Model1103: a.model({
        field1: a.string(),
      }),
      Model1104: a.model({
        field1: a.string(),
      }),
      Model1105: a.model({
        field1: a.string(),
      }),
      Model1106: a.model({
        field1: a.string(),
      }),
      Model1107: a.model({
        field1: a.string(),
      }),
      Model1108: a.model({
        field1: a.string(),
      }),
      Model1109: a.model({
        field1: a.string(),
      }),
      Model1110: a.model({
        field1: a.string(),
      }),
      Model1111: a.model({
        field1: a.string(),
      }),
      Model1112: a.model({
        field1: a.string(),
      }),
      Model1113: a.model({
        field1: a.string(),
      }),
      Model1114: a.model({
        field1: a.string(),
      }),
      Model1115: a.model({
        field1: a.string(),
      }),
      Model1116: a.model({
        field1: a.string(),
      }),
      Model1117: a.model({
        field1: a.string(),
      }),
      Model1118: a.model({
        field1: a.string(),
      }),
      Model1119: a.model({
        field1: a.string(),
      }),
      Model1120: a.model({
        field1: a.string(),
      }),
      Model1121: a.model({
        field1: a.string(),
      }),
      Model1122: a.model({
        field1: a.string(),
      }),
      Model1123: a.model({
        field1: a.string(),
      }),
      Model1124: a.model({
        field1: a.string(),
      }),
      Model1125: a.model({
        field1: a.string(),
      }),
      Model1126: a.model({
        field1: a.string(),
      }),
      Model1127: a.model({
        field1: a.string(),
      }),
      Model1128: a.model({
        field1: a.string(),
      }),
      Model1129: a.model({
        field1: a.string(),
      }),
      Model1130: a.model({
        field1: a.string(),
      }),
      Model1131: a.model({
        field1: a.string(),
      }),
      Model1132: a.model({
        field1: a.string(),
      }),
      Model1133: a.model({
        field1: a.string(),
      }),
      Model1134: a.model({
        field1: a.string(),
      }),
      Model1135: a.model({
        field1: a.string(),
      }),
      Model1136: a.model({
        field1: a.string(),
      }),
      Model1137: a.model({
        field1: a.string(),
      }),
      Model1138: a.model({
        field1: a.string(),
      }),
      Model1139: a.model({
        field1: a.string(),
      }),
      Model1140: a.model({
        field1: a.string(),
      }),
      Model1141: a.model({
        field1: a.string(),
      }),
      Model1142: a.model({
        field1: a.string(),
      }),
      Model1143: a.model({
        field1: a.string(),
      }),
      Model1144: a.model({
        field1: a.string(),
      }),
      Model1145: a.model({
        field1: a.string(),
      }),
      Model1146: a.model({
        field1: a.string(),
      }),
      Model1147: a.model({
        field1: a.string(),
      }),
      Model1148: a.model({
        field1: a.string(),
      }),
      Model1149: a.model({
        field1: a.string(),
      }),
      Model1150: a.model({
        field1: a.string(),
      }),
      Model1151: a.model({
        field1: a.string(),
      }),
      Model1152: a.model({
        field1: a.string(),
      }),
      Model1153: a.model({
        field1: a.string(),
      }),
      Model1154: a.model({
        field1: a.string(),
      }),
      Model1155: a.model({
        field1: a.string(),
      }),
      Model1156: a.model({
        field1: a.string(),
      }),
      Model1157: a.model({
        field1: a.string(),
      }),
      Model1158: a.model({
        field1: a.string(),
      }),
      Model1159: a.model({
        field1: a.string(),
      }),
      Model1160: a.model({
        field1: a.string(),
      }),
      Model1161: a.model({
        field1: a.string(),
      }),
      Model1162: a.model({
        field1: a.string(),
      }),
      Model1163: a.model({
        field1: a.string(),
      }),
      Model1164: a.model({
        field1: a.string(),
      }),
      Model1165: a.model({
        field1: a.string(),
      }),
      Model1166: a.model({
        field1: a.string(),
      }),
      Model1167: a.model({
        field1: a.string(),
      }),
      Model1168: a.model({
        field1: a.string(),
      }),
      Model1169: a.model({
        field1: a.string(),
      }),
      Model1170: a.model({
        field1: a.string(),
      }),
      Model1171: a.model({
        field1: a.string(),
      }),
      Model1172: a.model({
        field1: a.string(),
      }),
      Model1173: a.model({
        field1: a.string(),
      }),
      Model1174: a.model({
        field1: a.string(),
      }),
      Model1175: a.model({
        field1: a.string(),
      }),
      Model1176: a.model({
        field1: a.string(),
      }),
      Model1177: a.model({
        field1: a.string(),
      }),
      Model1178: a.model({
        field1: a.string(),
      }),
      Model1179: a.model({
        field1: a.string(),
      }),
      Model1180: a.model({
        field1: a.string(),
      }),
      Model1181: a.model({
        field1: a.string(),
      }),
      Model1182: a.model({
        field1: a.string(),
      }),
      Model1183: a.model({
        field1: a.string(),
      }),
      Model1184: a.model({
        field1: a.string(),
      }),
      Model1185: a.model({
        field1: a.string(),
      }),
      Model1186: a.model({
        field1: a.string(),
      }),
      Model1187: a.model({
        field1: a.string(),
      }),
      Model1188: a.model({
        field1: a.string(),
      }),
      Model1189: a.model({
        field1: a.string(),
      }),
      Model1190: a.model({
        field1: a.string(),
      }),
      Model1191: a.model({
        field1: a.string(),
      }),
      Model1192: a.model({
        field1: a.string(),
      }),
      Model1193: a.model({
        field1: a.string(),
      }),
      Model1194: a.model({
        field1: a.string(),
      }),
      Model1195: a.model({
        field1: a.string(),
      }),
      Model1196: a.model({
        field1: a.string(),
      }),
      Model1197: a.model({
        field1: a.string(),
      }),
      Model1198: a.model({
        field1: a.string(),
      }),
      Model1199: a.model({
        field1: a.string(),
      }),
      Model1200: a.model({
        field1: a.string(),
      }),
      Model1201: a.model({
        field1: a.string(),
      }),
      Model1202: a.model({
        field1: a.string(),
      }),
      Model1203: a.model({
        field1: a.string(),
      }),
      Model1204: a.model({
        field1: a.string(),
      }),
      Model1205: a.model({
        field1: a.string(),
      }),
      Model1206: a.model({
        field1: a.string(),
      }),
      Model1207: a.model({
        field1: a.string(),
      }),
      Model1208: a.model({
        field1: a.string(),
      }),
      Model1209: a.model({
        field1: a.string(),
      }),
      Model1210: a.model({
        field1: a.string(),
      }),
      Model1211: a.model({
        field1: a.string(),
      }),
      Model1212: a.model({
        field1: a.string(),
      }),
      Model1213: a.model({
        field1: a.string(),
      }),
      Model1214: a.model({
        field1: a.string(),
      }),
      Model1215: a.model({
        field1: a.string(),
      }),
      Model1216: a.model({
        field1: a.string(),
      }),
      Model1217: a.model({
        field1: a.string(),
      }),
      Model1218: a.model({
        field1: a.string(),
      }),
      Model1219: a.model({
        field1: a.string(),
      }),
      Model1220: a.model({
        field1: a.string(),
      }),
      Model1221: a.model({
        field1: a.string(),
      }),
      Model1222: a.model({
        field1: a.string(),
      }),
      Model1223: a.model({
        field1: a.string(),
      }),
      Model1224: a.model({
        field1: a.string(),
      }),
      Model1225: a.model({
        field1: a.string(),
      }),
      Model1226: a.model({
        field1: a.string(),
      }),
      Model1227: a.model({
        field1: a.string(),
      }),
      Model1228: a.model({
        field1: a.string(),
      }),
      Model1229: a.model({
        field1: a.string(),
      }),
      Model1230: a.model({
        field1: a.string(),
      }),
      Model1231: a.model({
        field1: a.string(),
      }),
      Model1232: a.model({
        field1: a.string(),
      }),
      Model1233: a.model({
        field1: a.string(),
      }),
      Model1234: a.model({
        field1: a.string(),
      }),
      Model1235: a.model({
        field1: a.string(),
      }),
      Model1236: a.model({
        field1: a.string(),
      }),
      Model1237: a.model({
        field1: a.string(),
      }),
      Model1238: a.model({
        field1: a.string(),
      }),
      Model1239: a.model({
        field1: a.string(),
      }),
      Model1240: a.model({
        field1: a.string(),
      }),
      Model1241: a.model({
        field1: a.string(),
      }),
      Model1242: a.model({
        field1: a.string(),
      }),
      Model1243: a.model({
        field1: a.string(),
      }),
      Model1244: a.model({
        field1: a.string(),
      }),
      Model1245: a.model({
        field1: a.string(),
      }),
      Model1246: a.model({
        field1: a.string(),
      }),
      Model1247: a.model({
        field1: a.string(),
      }),
      Model1248: a.model({
        field1: a.string(),
      }),
      Model1249: a.model({
        field1: a.string(),
      }),
      Model1250: a.model({
        field1: a.string(),
      }),
      Model1251: a.model({
        field1: a.string(),
      }),
      Model1252: a.model({
        field1: a.string(),
      }),
      Model1253: a.model({
        field1: a.string(),
      }),
      Model1254: a.model({
        field1: a.string(),
      }),
      Model1255: a.model({
        field1: a.string(),
      }),
      Model1256: a.model({
        field1: a.string(),
      }),
      Model1257: a.model({
        field1: a.string(),
      }),
      Model1258: a.model({
        field1: a.string(),
      }),
      Model1259: a.model({
        field1: a.string(),
      }),
      Model1260: a.model({
        field1: a.string(),
      }),
      Model1261: a.model({
        field1: a.string(),
      }),
      Model1262: a.model({
        field1: a.string(),
      }),
      Model1263: a.model({
        field1: a.string(),
      }),
      Model1264: a.model({
        field1: a.string(),
      }),
      Model1265: a.model({
        field1: a.string(),
      }),
      Model1266: a.model({
        field1: a.string(),
      }),
      Model1267: a.model({
        field1: a.string(),
      }),
      Model1268: a.model({
        field1: a.string(),
      }),
      Model1269: a.model({
        field1: a.string(),
      }),
      Model1270: a.model({
        field1: a.string(),
      }),
      Model1271: a.model({
        field1: a.string(),
      }),
      Model1272: a.model({
        field1: a.string(),
      }),
      Model1273: a.model({
        field1: a.string(),
      }),
      Model1274: a.model({
        field1: a.string(),
      }),
      Model1275: a.model({
        field1: a.string(),
      }),
      Model1276: a.model({
        field1: a.string(),
      }),
      Model1277: a.model({
        field1: a.string(),
      }),
      Model1278: a.model({
        field1: a.string(),
      }),
      Model1279: a.model({
        field1: a.string(),
      }),
      Model1280: a.model({
        field1: a.string(),
      }),
      Model1281: a.model({
        field1: a.string(),
      }),
      Model1282: a.model({
        field1: a.string(),
      }),
      Model1283: a.model({
        field1: a.string(),
      }),
      Model1284: a.model({
        field1: a.string(),
      }),
      Model1285: a.model({
        field1: a.string(),
      }),
      Model1286: a.model({
        field1: a.string(),
      }),
      Model1287: a.model({
        field1: a.string(),
      }),
      Model1288: a.model({
        field1: a.string(),
      }),
      Model1289: a.model({
        field1: a.string(),
      }),
      Model1290: a.model({
        field1: a.string(),
      }),
      Model1291: a.model({
        field1: a.string(),
      }),
      Model1292: a.model({
        field1: a.string(),
      }),
      Model1293: a.model({
        field1: a.string(),
      }),
      Model1294: a.model({
        field1: a.string(),
      }),
      Model1295: a.model({
        field1: a.string(),
      }),
      Model1296: a.model({
        field1: a.string(),
      }),
      Model1297: a.model({
        field1: a.string(),
      }),
      Model1298: a.model({
        field1: a.string(),
      }),
      Model1299: a.model({
        field1: a.string(),
      }),
      Model1300: a.model({
        field1: a.string(),
      }),
      Model1301: a.model({
        field1: a.string(),
      }),
      Model1302: a.model({
        field1: a.string(),
      }),
      Model1303: a.model({
        field1: a.string(),
      }),
      Model1304: a.model({
        field1: a.string(),
      }),
      Model1305: a.model({
        field1: a.string(),
      }),
      Model1306: a.model({
        field1: a.string(),
      }),
      Model1307: a.model({
        field1: a.string(),
      }),
      Model1308: a.model({
        field1: a.string(),
      }),
      Model1309: a.model({
        field1: a.string(),
      }),
      Model1310: a.model({
        field1: a.string(),
      }),
      Model1311: a.model({
        field1: a.string(),
      }),
      Model1312: a.model({
        field1: a.string(),
      }),
      Model1313: a.model({
        field1: a.string(),
      }),
      Model1314: a.model({
        field1: a.string(),
      }),
      Model1315: a.model({
        field1: a.string(),
      }),
      Model1316: a.model({
        field1: a.string(),
      }),
      Model1317: a.model({
        field1: a.string(),
      }),
      Model1318: a.model({
        field1: a.string(),
      }),
      Model1319: a.model({
        field1: a.string(),
      }),
      Model1320: a.model({
        field1: a.string(),
      }),
      Model1321: a.model({
        field1: a.string(),
      }),
      Model1322: a.model({
        field1: a.string(),
      }),
      Model1323: a.model({
        field1: a.string(),
      }),
      Model1324: a.model({
        field1: a.string(),
      }),
      Model1325: a.model({
        field1: a.string(),
      }),
      Model1326: a.model({
        field1: a.string(),
      }),
      Model1327: a.model({
        field1: a.string(),
      }),
      Model1328: a.model({
        field1: a.string(),
      }),
      Model1329: a.model({
        field1: a.string(),
      }),
      Model1330: a.model({
        field1: a.string(),
      }),
      Model1331: a.model({
        field1: a.string(),
      }),
      Model1332: a.model({
        field1: a.string(),
      }),
      Model1333: a.model({
        field1: a.string(),
      }),
      Model1334: a.model({
        field1: a.string(),
      }),
      Model1335: a.model({
        field1: a.string(),
      }),
      Model1336: a.model({
        field1: a.string(),
      }),
      Model1337: a.model({
        field1: a.string(),
      }),
      Model1338: a.model({
        field1: a.string(),
      }),
      Model1339: a.model({
        field1: a.string(),
      }),
      Model1340: a.model({
        field1: a.string(),
      }),
      Model1341: a.model({
        field1: a.string(),
      }),
      Model1342: a.model({
        field1: a.string(),
      }),
      Model1343: a.model({
        field1: a.string(),
      }),
      Model1344: a.model({
        field1: a.string(),
      }),
      Model1345: a.model({
        field1: a.string(),
      }),
      Model1346: a.model({
        field1: a.string(),
      }),
      Model1347: a.model({
        field1: a.string(),
      }),
      Model1348: a.model({
        field1: a.string(),
      }),
      Model1349: a.model({
        field1: a.string(),
      }),
      Model1350: a.model({
        field1: a.string(),
      }),
      Model1351: a.model({
        field1: a.string(),
      }),
      Model1352: a.model({
        field1: a.string(),
      }),
      Model1353: a.model({
        field1: a.string(),
      }),
      Model1354: a.model({
        field1: a.string(),
      }),
      Model1355: a.model({
        field1: a.string(),
      }),
      Model1356: a.model({
        field1: a.string(),
      }),
      Model1357: a.model({
        field1: a.string(),
      }),
      Model1358: a.model({
        field1: a.string(),
      }),
      Model1359: a.model({
        field1: a.string(),
      }),
      Model1360: a.model({
        field1: a.string(),
      }),
      Model1361: a.model({
        field1: a.string(),
      }),
      Model1362: a.model({
        field1: a.string(),
      }),
      Model1363: a.model({
        field1: a.string(),
      }),
      Model1364: a.model({
        field1: a.string(),
      }),
      Model1365: a.model({
        field1: a.string(),
      }),
      Model1366: a.model({
        field1: a.string(),
      }),
      Model1367: a.model({
        field1: a.string(),
      }),
      Model1368: a.model({
        field1: a.string(),
      }),
      Model1369: a.model({
        field1: a.string(),
      }),
      Model1370: a.model({
        field1: a.string(),
      }),
      Model1371: a.model({
        field1: a.string(),
      }),
      Model1372: a.model({
        field1: a.string(),
      }),
      Model1373: a.model({
        field1: a.string(),
      }),
      Model1374: a.model({
        field1: a.string(),
      }),
      Model1375: a.model({
        field1: a.string(),
      }),
      Model1376: a.model({
        field1: a.string(),
      }),
      Model1377: a.model({
        field1: a.string(),
      }),
      Model1378: a.model({
        field1: a.string(),
      }),
      Model1379: a.model({
        field1: a.string(),
      }),
      Model1380: a.model({
        field1: a.string(),
      }),
      Model1381: a.model({
        field1: a.string(),
      }),
      Model1382: a.model({
        field1: a.string(),
      }),
      Model1383: a.model({
        field1: a.string(),
      }),
      Model1384: a.model({
        field1: a.string(),
      }),
      Model1385: a.model({
        field1: a.string(),
      }),
      Model1386: a.model({
        field1: a.string(),
      }),
      Model1387: a.model({
        field1: a.string(),
      }),
      Model1388: a.model({
        field1: a.string(),
      }),
      Model1389: a.model({
        field1: a.string(),
      }),
      Model1390: a.model({
        field1: a.string(),
      }),
      Model1391: a.model({
        field1: a.string(),
      }),
      Model1392: a.model({
        field1: a.string(),
      }),
      Model1393: a.model({
        field1: a.string(),
      }),
      Model1394: a.model({
        field1: a.string(),
      }),
      Model1395: a.model({
        field1: a.string(),
      }),
      Model1396: a.model({
        field1: a.string(),
      }),
      Model1397: a.model({
        field1: a.string(),
      }),
      Model1398: a.model({
        field1: a.string(),
      }),
      Model1399: a.model({
        field1: a.string(),
      }),
      Model1400: a.model({
        field1: a.string(),
      }),
      Model1401: a.model({
        field1: a.string(),
      }),
      Model1402: a.model({
        field1: a.string(),
      }),
      Model1403: a.model({
        field1: a.string(),
      }),
      Model1404: a.model({
        field1: a.string(),
      }),
      Model1405: a.model({
        field1: a.string(),
      }),
      Model1406: a.model({
        field1: a.string(),
      }),
      Model1407: a.model({
        field1: a.string(),
      }),
      Model1408: a.model({
        field1: a.string(),
      }),
      Model1409: a.model({
        field1: a.string(),
      }),
      Model1410: a.model({
        field1: a.string(),
      }),
      Model1411: a.model({
        field1: a.string(),
      }),
      Model1412: a.model({
        field1: a.string(),
      }),
      Model1413: a.model({
        field1: a.string(),
      }),
      Model1414: a.model({
        field1: a.string(),
      }),
      Model1415: a.model({
        field1: a.string(),
      }),
      Model1416: a.model({
        field1: a.string(),
      }),
      Model1417: a.model({
        field1: a.string(),
      }),
      Model1418: a.model({
        field1: a.string(),
      }),
      Model1419: a.model({
        field1: a.string(),
      }),
      Model1420: a.model({
        field1: a.string(),
      }),
      Model1421: a.model({
        field1: a.string(),
      }),
      Model1422: a.model({
        field1: a.string(),
      }),
      Model1423: a.model({
        field1: a.string(),
      }),
      Model1424: a.model({
        field1: a.string(),
      }),
      Model1425: a.model({
        field1: a.string(),
      }),
      Model1426: a.model({
        field1: a.string(),
      }),
      Model1427: a.model({
        field1: a.string(),
      }),
      Model1428: a.model({
        field1: a.string(),
      }),
      Model1429: a.model({
        field1: a.string(),
      }),
      Model1430: a.model({
        field1: a.string(),
      }),
      Model1431: a.model({
        field1: a.string(),
      }),
      Model1432: a.model({
        field1: a.string(),
      }),
      Model1433: a.model({
        field1: a.string(),
      }),
      Model1434: a.model({
        field1: a.string(),
      }),
      Model1435: a.model({
        field1: a.string(),
      }),
      Model1436: a.model({
        field1: a.string(),
      }),
      Model1437: a.model({
        field1: a.string(),
      }),
      Model1438: a.model({
        field1: a.string(),
      }),
      Model1439: a.model({
        field1: a.string(),
      }),
      Model1440: a.model({
        field1: a.string(),
      }),
      Model1441: a.model({
        field1: a.string(),
      }),
      Model1442: a.model({
        field1: a.string(),
      }),
      Model1443: a.model({
        field1: a.string(),
      }),
      Model1444: a.model({
        field1: a.string(),
      }),
      Model1445: a.model({
        field1: a.string(),
      }),
      Model1446: a.model({
        field1: a.string(),
      }),
      Model1447: a.model({
        field1: a.string(),
      }),
      Model1448: a.model({
        field1: a.string(),
      }),
      Model1449: a.model({
        field1: a.string(),
      }),
      Model1450: a.model({
        field1: a.string(),
      }),
      Model1451: a.model({
        field1: a.string(),
      }),
      Model1452: a.model({
        field1: a.string(),
      }),
      Model1453: a.model({
        field1: a.string(),
      }),
      Model1454: a.model({
        field1: a.string(),
      }),
      Model1455: a.model({
        field1: a.string(),
      }),
      Model1456: a.model({
        field1: a.string(),
      }),
      Model1457: a.model({
        field1: a.string(),
      }),
      Model1458: a.model({
        field1: a.string(),
      }),
      Model1459: a.model({
        field1: a.string(),
      }),
      Model1460: a.model({
        field1: a.string(),
      }),
      Model1461: a.model({
        field1: a.string(),
      }),
      Model1462: a.model({
        field1: a.string(),
      }),
      Model1463: a.model({
        field1: a.string(),
      }),
      Model1464: a.model({
        field1: a.string(),
      }),
      Model1465: a.model({
        field1: a.string(),
      }),
      Model1466: a.model({
        field1: a.string(),
      }),
      Model1467: a.model({
        field1: a.string(),
      }),
      Model1468: a.model({
        field1: a.string(),
      }),
      Model1469: a.model({
        field1: a.string(),
      }),
      Model1470: a.model({
        field1: a.string(),
      }),
      Model1471: a.model({
        field1: a.string(),
      }),
      Model1472: a.model({
        field1: a.string(),
      }),
      Model1473: a.model({
        field1: a.string(),
      }),
      Model1474: a.model({
        field1: a.string(),
      }),
      Model1475: a.model({
        field1: a.string(),
      }),
      Model1476: a.model({
        field1: a.string(),
      }),
      Model1477: a.model({
        field1: a.string(),
      }),
      Model1478: a.model({
        field1: a.string(),
      }),
      Model1479: a.model({
        field1: a.string(),
      }),
      Model1480: a.model({
        field1: a.string(),
      }),
      Model1481: a.model({
        field1: a.string(),
      }),
      Model1482: a.model({
        field1: a.string(),
      }),
      Model1483: a.model({
        field1: a.string(),
      }),
      Model1484: a.model({
        field1: a.string(),
      }),
      Model1485: a.model({
        field1: a.string(),
      }),
      Model1486: a.model({
        field1: a.string(),
      }),
      Model1487: a.model({
        field1: a.string(),
      }),
      Model1488: a.model({
        field1: a.string(),
      }),
      Model1489: a.model({
        field1: a.string(),
      }),
      Model1490: a.model({
        field1: a.string(),
      }),
      Model1491: a.model({
        field1: a.string(),
      }),
      Model1492: a.model({
        field1: a.string(),
      }),
      Model1493: a.model({
        field1: a.string(),
      }),
      Model1494: a.model({
        field1: a.string(),
      }),
      Model1495: a.model({
        field1: a.string(),
      }),
      Model1496: a.model({
        field1: a.string(),
      }),
      Model1497: a.model({
        field1: a.string(),
      }),
      Model1498: a.model({
        field1: a.string(),
      }),
      Model1499: a.model({
        field1: a.string(),
      }),
      Model1500: a.model({
        field1: a.string(),
      }),
      Model1501: a.model({
        field1: a.string(),
      }),
      Model1502: a.model({
        field1: a.string(),
      }),
      Model1503: a.model({
        field1: a.string(),
      }),
      Model1504: a.model({
        field1: a.string(),
      }),
      Model1505: a.model({
        field1: a.string(),
      }),
      Model1506: a.model({
        field1: a.string(),
      }),
      Model1507: a.model({
        field1: a.string(),
      }),
      Model1508: a.model({
        field1: a.string(),
      }),
      Model1509: a.model({
        field1: a.string(),
      }),
      Model1510: a.model({
        field1: a.string(),
      }),
      Model1511: a.model({
        field1: a.string(),
      }),
      Model1512: a.model({
        field1: a.string(),
      }),
      Model1513: a.model({
        field1: a.string(),
      }),
      Model1514: a.model({
        field1: a.string(),
      }),
      Model1515: a.model({
        field1: a.string(),
      }),
      Model1516: a.model({
        field1: a.string(),
      }),
      Model1517: a.model({
        field1: a.string(),
      }),
      Model1518: a.model({
        field1: a.string(),
      }),
      Model1519: a.model({
        field1: a.string(),
      }),
      Model1520: a.model({
        field1: a.string(),
      }),
      Model1521: a.model({
        field1: a.string(),
      }),
      Model1522: a.model({
        field1: a.string(),
      }),
    })
    .authorization([a.allow.public()]);

  type _ = ClientSchema<typeof schema>;

  // TODO:
  // Amplify.configure({
  //   API: {
  //     GraphQL: {
  //       apiKey: 'apikey',
  //       defaultAuthMode: 'apiKey',
  //       endpoint: 'https://0.0.0.0/graphql',
  //       region: 'us-east-1',
  //     },
  //   },
  // });

  // const client = generateClient<Schema>();

  // const result = await client.models.Model1.create({
  //   field1: 'Field 1',
  // });

  // await client.models.Model1.get({ id: result.data.id });

  // await client.models.Model1.update({
  //   id: result.data.id,
  //   field1: 'Updated Field 1',
  // });

  // await client.models.Model1.delete({ id: result.data.id });

  // await client.models.Model1.list();
}).types([9618857, 'instantiations']);
