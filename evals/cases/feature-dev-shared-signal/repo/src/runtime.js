export function cancel() { return {aborted:true, reason:"cancelled"}; }
export function expire() { return {aborted:true, reason:"expired"}; }
