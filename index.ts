import { serve } from 'https://deno.land/std/http/server.ts';
import { CasualDB } from 'https://deno.land/x/casualdb/mod.ts';
import AsciiTable, { AsciiAlign } from 'https://deno.land/x/ascii_table/mod.ts';

/* ========================== *\
	Config: Config
\* ========================== */
const server = serve({ port: 8000 });


/* ========================== *\
	Config: Database
\* ========================== */

interface Schema {
  addresses: Array<{
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  }>;
}

const db = new CasualDB<Schema>(); 
await db.connect("./addresses.json");
const addresses = await db.get<Schema['addresses']>('addresses'); // pass the interface key in order for type-checking to work


console.log('Go for it...\n') ;
for await (const req of server) {

	const u = new URL('http://' + 'localhost:8000' + req.url);
	const qsField = u.searchParams.get('field') || "state";
	const qsValue = u.searchParams.get('value') || "";
	let listAddresses:any = [];

switch (qsField) {
  case 'line1': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.line1.indexOf(qsValue) > -1
	  })
	  .value()
	);
    break;
  }
  case 'line2': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.line2.indexOf(qsValue) > -1
	  })
	  .value()
	);
    break;
  }
  case 'city': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.city.indexOf(qsValue) > -1
	  })
	  .value()
	);
    break;
  }
  case 'state': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.state === qsValue.toUpperCase()
	  })
	  .value()
	);
    break;
  }
  case 'zip': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.zip.indexOf(qsValue) > -1
	  })
	  .value()
	);
    break;
  }
  case 'any': {
	listAddresses = (
	  addresses
	  .sort(['state']) // (ascending)
	  .findAll((value) => {
    	return value.line1.indexOf(qsValue) > -1 || 
//    	  value.line2.indexOf(qsValue) > -1 || 
    	  value.city.indexOf(qsValue) > -1 || 
    	  value.state.indexOf(qsValue) > -1 || 
    	  value.zip.indexOf(qsValue) > -1
	  })
	  .value()
	);
    break;
  }
  default:
    console.log(`Sorry, cannot find ${qsField}.`);
}


  const tableOut = '<html><body><table>'
    + '<tr>'
      + '<th>line1</td>'
      + '<th>line2</td>'
      + '<th>city</td>'
      + '<th>state</td>'
      + '<th>zip</td>'
    + '</tr>'
    + listAddresses.map(function (address: any) {
  	return '<tr>'
  	  + '<td>' + address.line1 + '</td>'
      + '<td>' + (address.line2 || "") + '</td>'
      + '<td>' + address.city + '</td>'
      + '<td>' + address.state + '</td>'
      + '<td>' + address.zip + '</td>'
      + '</tr>';
  }).join('');



  req.respond({ body: tableOut.toString() });
//  req.respond({ body: u.toString() });


//  console.log(req, u);
  console.log(qsField, qsValue, typeof listAddresses);
  console.table(listAddresses);
  console.log(tableOut);
}




//    .sort(['state']) // sort by views (ascending)
//    .pick(['line1']) // pick the title of every post
