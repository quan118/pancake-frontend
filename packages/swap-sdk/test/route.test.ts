import { Token, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Pair, Route, Native } from '../src/entities'
import { ChainId, WNATIVE } from '../src/constants'

describe('Route', () => {
  const ETHER = Native.onChain(ChainId.BSC)
  const token0 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18, 't0')
  const token1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18, 't1')
  const weth = WNATIVE[ChainId.BSC]
  const pair01 = new Pair(CurrencyAmount.fromRawAmount(token0, '100'), CurrencyAmount.fromRawAmount(token1, '200'))
  const pair0Weth = new Pair(CurrencyAmount.fromRawAmount(token0, '100'), CurrencyAmount.fromRawAmount(weth, '100'))
  const pair1Weth = new Pair(CurrencyAmount.fromRawAmount(token1, '175'), CurrencyAmount.fromRawAmount(weth, '100'))

  it('constructs a path from the tokens', () => {
    const route = new Route([pair01], token0, token1)
    expect(route.pairs).toEqual([pair01])
    expect(route.path).toEqual([token0, token1])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(token1)
    expect(route.chainId).toEqual(ChainId.BSC)
  })

  it('can have a token as both input and output', () => {
    const route = new Route([pair0Weth, pair01, pair1Weth], weth, weth)
    expect(route.pairs).toEqual([pair0Weth, pair01, pair1Weth])
    expect(route.input).toEqual(weth)
    expect(route.output).toEqual(weth)
  })

  it('supports ether input', () => {
    const route = new Route([pair0Weth], ETHER, token0)
    expect(route.pairs).toEqual([pair0Weth])
    expect(route.input).toEqual(ETHER)
    expect(route.output).toEqual(token0)
  })

  it('supports ether output', () => {
    const route = new Route([pair0Weth], token0, ETHER)
    expect(route.pairs).toEqual([pair0Weth])
    expect(route.input).toEqual(token0)
    expect(route.output).toEqual(ETHER)
  })

  it("midPrice", () => {
    const t0 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000001', 18, 't0');
    const t1 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000002', 18, 't1');
    const t2 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000003', 18, 't2');
    const t3 = new Token(ChainId.BSC, '0x0000000000000000000000000000000000000004', 18, 't3');

    const p0 = new Pair(CurrencyAmount.fromRawAmount(t0, '1000'), CurrencyAmount.fromRawAmount(t1, '1500'));
    const p1 = new Pair(CurrencyAmount.fromRawAmount(t1, '2000'), CurrencyAmount.fromRawAmount(t2, '2500'));
    const p2 = new Pair(CurrencyAmount.fromRawAmount(t2, '3000'), CurrencyAmount.fromRawAmount(t3, '3500'));

    const route = new Route([p0, p1, p2], t0, t2);

    // expect(route.midPrice.numerator.toString()).toEqual("6000000000");
    // expect(route.midPrice.denominator.toString()).toEqual("13125000000");
    // console.log(route.midPrice);
    expect(route.midPrice.quotient.toString()).toEqual("2");
  });
})
