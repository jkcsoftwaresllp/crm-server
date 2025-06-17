import slugify from 'slugify';

import db from '../configs/db.js';



const makeCandidate = (input) =>

  slugify(input, {

    lower: true,

    strict: true,

  }).substring(0, 63);



export const getUniqueSubdomain = async (rawInput) => {

  let candidate = makeCandidate(rawInput || 'tenant');

  let suffix = 0;



  let [rows] = await db.execute(

    'SELECT 1 FROM organizations WHERE subdomain = ? LIMIT 1',

    [candidate]

  );



  while (rows.length > 0) {

    suffix += 1;

    const next = `${candidate}-${suffix}`;

    candidate = next.length > 63 ? next.slice(0, 63) : next;



    [rows] = await db.execute(

      'SELECT 1 FROM organizations WHERE subdomain = ? LIMIT 1',

      [candidate]

    );

  }



  return candidate;

};