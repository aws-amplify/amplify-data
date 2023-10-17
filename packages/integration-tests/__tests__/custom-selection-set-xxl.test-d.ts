import { a, ClientSchema } from '@aws-amplify/amplify-api-next-alpha';
import { Expect, Equal } from '@aws-amplify/amplify-api-next-types-alpha';
import { API } from 'aws-amplify';

describe('Custom Selection Set XXL', () => {
  describe('Basic, single model', () => {
    const schema = a.schema({
      Blog: a.model({
        name: a.string(),
        posts: a.hasMany('Post'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment: a.model({
        content: a.string(),
        post: a.belongsTo('Post'),
        blogs2: a.hasMany('Blog2'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Blog2: a.model({
        name: a.string(),
        posts2: a.hasMany('Post2'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post2: a.model({
        title: a.string().required(),
        description: a.string(),
        comments2: a.hasMany('Comment2'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment2: a.model({
        content: a.string(),
        post: a.belongsTo('Post2'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Blog3: a.model({
        name: a.string(),
        posts: a.hasMany('Post3'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post3: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment3'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment3: a.model({
        content: a.string(),
        post: a.belongsTo('Post3'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Blog4: a.model({
        name: a.string(),
        posts: a.hasMany('Post4'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post4: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment4'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment4: a.model({
        content: a.string(),
        post: a.belongsTo('Post4'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Blog5: a.model({
        name: a.string(),
        posts: a.hasMany('Post5'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post5: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment5'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment5: a.model({
        content: a.string(),
        post: a.belongsTo('Post5'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Blog6: a.model({
        name: a.string(),
        posts: a.hasMany('Post6'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Post6: a.model({
        title: a.string().required(),
        description: a.string(),
        comments: a.hasMany('Comment6'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
      Comment6: a.model({
        content: a.string(),
        post: a.belongsTo('Post6'),
        // #region 50 fields
        field1: a.string(),
        field2: a.string(),
        field3: a.string(),
        field4: a.string(),
        field5: a.string(),
        field6: a.string(),
        field7: a.string(),
        field8: a.string(),
        field9: a.string(),
        field10: a.string(),
        field11: a.string(),
        field12: a.string(),
        field13: a.string(),
        field14: a.string(),
        field15: a.string(),
        field16: a.string(),
        field17: a.string(),
        field18: a.string(),
        field19: a.string(),
        field20: a.string(),
        field21: a.string(),
        field22: a.string(),
        field23: a.string(),
        field24: a.string(),
        field25: a.string(),
        field26: a.string(),
        field27: a.string(),
        field28: a.string(),
        field29: a.string(),
        field30: a.string(),
        field31: a.string(),
        field32: a.string(),
        field33: a.string(),
        field34: a.string(),
        field35: a.string(),
        field36: a.string(),
        field37: a.string(),
        field38: a.string(),
        field39: a.string(),
        field40: a.string(),
        field41: a.string(),
        field42: a.string(),
        field43: a.string(),
        field44: a.string(),
        field45: a.string(),
        field46: a.string(),
        field47: a.string(),
        field48: a.string(),
        field49: a.string(),
        field50: a.string(),
        // #endregion
      }),
    });

    type Schema = ClientSchema<typeof schema>;

    test('can specify custom selection set for a subset of fields', async () => {
      const client = API.generateClient<Schema>();

      const blogs = await client.models.Blog.list({
        selectionSet: [
          'id',
          'posts.comments.blogs2.posts2.comments2.field1',
          'posts.comments.blogs2.posts2.comments2.field50',
        ],
      });

      type ExpectedType = {
        readonly id: string;
        readonly posts: {
          readonly comments: {
            readonly blogs2: {
              readonly posts2: {
                readonly comments2: {
                  readonly field1: string | null;
                  readonly field50: string | null;
                }[];
              }[];
            }[];
          }[];
        }[];
      }[];

      type test = Expect<Equal<typeof blogs.data, ExpectedType>>;
    });
  });
});
