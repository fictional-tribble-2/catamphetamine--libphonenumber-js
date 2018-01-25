import chai, { expect } from 'chai'
chai.should()

import metadata from '../metadata.min'
import get_number_type_custom from '../source/types'

function get_number_type(...parameters)
{
	parameters.push(metadata)
	return get_number_type_custom.apply(this, parameters)
}

describe('get_number_type', () =>
{
	it('should infer phone number types', function()
	{
		get_number_type('88005553535', 'RU', metadata).should.equal('TOLL_FREE')
		get_number_type('8005553535', 'RU', metadata).should.equal('TOLL_FREE')
		get_number_type('4957777777', 'RU', metadata).should.equal('FIXED_LINE')
		get_number_type('9150000000', 'RU', metadata).should.equal('MOBILE')
		get_number_type('8030000000', 'RU', metadata).should.equal('PREMIUM_RATE')

		get_number_type('2133734253', 'US', metadata).should.equal('FIXED_LINE_OR_MOBILE')
		get_number_type('5002345678', 'US', metadata).should.equal('PERSONAL_NUMBER')
	})

	it('should return FIXED_LINE_OR_MOBILE when there is ambiguity', () =>
	{
		// (no such country in the metadata, therefore no unit test for this `if`)
	})

	it('should work in edge cases', function()
	{
		// No metadata
		let thrower = () => get_number_type_custom({ phone: '+78005553535' })
		thrower.should.throw('Metadata is required')

		// Parsed phone number
		get_number_type({ phone: '8005553535', country: 'RU' }).should.equal('TOLL_FREE')

		// Invalid phone number
		type(get_number_type('123', 'RU')).should.equal('undefined')

		// Numerical `value`
		thrower = () => get_number_type(89150000000, 'RU')
		thrower.should.throw('A phone number must either be a string or an object of shape { phone, [country] }.')
	})
})

function type(something)
{
	return typeof something
}