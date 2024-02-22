"use strict";

/* Parser combinator based parser for the
 * protobuf text format.
 */

const Parsimmon = require('parsimmon');

const regex = Parsimmon.regex
  , string = Parsimmon.string
  , optWhitespace = Parsimmon.optWhitespace
  , lazy = Parsimmon.lazy
  , alt = Parsimmon.alt
  , seq = Parsimmon.seq;

const comment = regex(/#.+/).then(optWhitespace.atMost(1));
const whitespace = optWhitespace.then(comment.atMost(1));

const lexeme = function(p){ return p.skip(whitespace); }

const colon = lexeme(string(':'));

const lbrace = lexeme(string('{'))
  , rbrace = lexeme(string('}'));

const stripFirstLast = function(x) {
  return x.substr(1, x.length-2);
};

const identifier = lexeme(regex(/[a-zA-Z_][0-9a-zA-Z_+-]*/));
const doubleString = lexeme(regex(/\"([^\"\\]|\\.)*\"/).map(stripFirstLast));
const singleString = lexeme(regex(/\'([^\'\\]|\\.)*\'/).map(stripFirstLast));

const number = lexeme(regex(/[.]?[0-9+-][0-9a-zA-Z_.+-]*/)).map(Number);
const trueLiteral = lexeme(string('true')).result(true);
const falseLiteral = lexeme(string('false')).result(false);

const expr = lazy('an expression', function() { return alt(pair, message).many(); });

const message = seq(identifier, colon.times(0, 1).then(lbrace).then(expr).skip(rbrace))
                .map(function(message) {
                  return { type: 'message', name: message[0], values: message[1] };
                });

const value = alt(trueLiteral, falseLiteral, number, doubleString, singleString, identifier);

const pair = seq(identifier.skip(colon), value)
            .map(function(pair) {
              return { type: 'pair', name: pair[0], value: pair[1] };
            });

module.exports = function(input) {
  const result = whitespace.then(expr).parse(input);
  if (!result.status) {
    result.error = Parsimmon.formatError(input, result);
  }
  return result;
};

