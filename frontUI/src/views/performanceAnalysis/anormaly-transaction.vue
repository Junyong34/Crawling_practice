<template>
	<div class="anormaly-trasaction-view">
		<div class="header"></div>
		<div class="contents">
			<div
				class="transaction-list"
				id="origin-traction-tree"
				ref="originTractionTreeContainer"
			></div>
			<div
				class="transaction-trace"
				id="transaction-tree-container"
				ref="transactionTreeContainer"
			></div>
		</div>
	</div>
</template>
<script>
import TransactionTraceTree from '@/components/d3/transactionTraceTree';
import OriginTree from '@/components/d3/originTransactionTraceTree';
import viewMixin from '@/mixins/viewMixin';

export default {
	name: 'AnormalyTransaction',
	mixins: [viewMixin],
	// components: {},
	// props: {},
	data() {
		return {
			transactionTraceTree: null,
			resData: [
				{
					abnormal: false,
					lower_bound: 0,
					mean: 124.53716278076172,
					elapse_time: 26,
					upper_bound: 327.19586181640625,
					tid: '6686725012359481448',
					method_sig:
						'javax/servlet/http/HttpServlet.service(HttpServletRequest, HttpServletResponse)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 2.814814805984497,
					elapse_time: 4,
					upper_bound: 9.13800048828125,
					tid: '6686725012359481448',
					method_sig: 'javax/xml/transform/FactoryFinder.find(Class, String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002072002040222287,
					elapse_time: 0,
					upper_bound: 0.13848815858364105,
					tid: '6686725012359481448',
					method_sig: 'javax/xml/transform/FactoryFinder.dPrint(String)',
				},
				{
					abnormal: true,
					lower_bound: 0,
					mean: 0.00699300691485405,
					elapse_time: 1,
					upper_bound: 0.25699302554130554,
					tid: '6686725012359481448',
					method_sig: 'javax/xml/transform/SecuritySupport.getSystemProperty(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 2.797461748123169,
					elapse_time: 3,
					upper_bound: 9.116769790649414,
					tid: '6686725012359481448',
					method_sig: 'javax/xml/transform/FactoryFinder.findServiceProvider(Class)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 2.7899508476257324,
					elapse_time: 3,
					upper_bound: 9.101690292358398,
					tid: '6686725012359481448',
					method_sig: 'javax/xml/transform/FactoryFinder$1.run()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 102.32219696044922,
					elapse_time: 0,
					upper_bound: 295.15203857421875,
					tid: '6686725012359481448',
					method_sig:
						'org/springframework/jdbc/datasource/AbstractDriverBasedDataSource.getConnection()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 101.2442398071289,
					elapse_time: 0,
					upper_bound: 292.7270202636719,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OracleDriver.connect(String, Properties)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0010360010201111436,
					elapse_time: 0,
					upper_bound: 0.09755133837461472,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_IS_OPEN.10.10.31.216:15213',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532988876104355,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_OS_OPEN.10.10.31.216:15214',
				},
				{
					abnormal: true,
					lower_bound: 0,
					mean: 0.022533021867275238,
					elapse_time: 1,
					upper_bound: 0.4677703380584717,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.getInstance(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.018648019060492516,
					elapse_time: 0,
					upper_bound: 0.424483060836792,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.nextSpi(SecretKeyFactorySpi)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002590002492070198,
					elapse_time: 0,
					upper_bound: 0.15506769716739655,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/JceSecurity.canUseProvider(Provider)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0005180005100555718,
					elapse_time: 0,
					upper_bound: 0.06877876818180084,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/JceSecurity.getVerificationResult(Provider)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 26.762237548828125,
					elapse_time: 0,
					upper_bound: 59.94956970214844,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.generateSecret(KeySpec)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.04853275045752525,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/spec/PBEKeySpec.getPassword()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532795161008835,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/spec/PBEKeySpec.getSalt()',
				},
				{
					abnormal: true,
					lower_bound: 0,
					mean: 0.0077700079418718815,
					elapse_time: 2,
					upper_bound: 0.2965141534805298,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.getInstance(String, Provider)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.00699300691485405,
					elapse_time: 0,
					upper_bound: 0.2835492193698883,
					tid: '6686725012359481448',
					method_sig:
						'javax/crypto/JceSecurity.getInstance(String, Class, String, Provider)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532918095588684,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/JceSecurity.getVerificationResult(Provider)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0018130018142983317,
					elapse_time: 0,
					upper_bound: 0.21220166981220245,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002590002492070198,
					elapse_time: 0,
					upper_bound: 0.15506744384765625,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.init(Key)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 5.975395202636719,
					elapse_time: 0,
					upper_bound: 15.723854064941406,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.update(byte[])',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.26236724853515625,
					elapse_time: 0,
					upper_bound: 1.8396331071853638,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 19.04325294494629,
					elapse_time: 0,
					upper_bound: 43.95173645019531,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal(byte[], int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.5249935388565063,
					elapse_time: 0,
					upper_bound: 2.771378993988037,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 16.161357879638672,
					elapse_time: 0,
					upper_bound: 37.946189880371094,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.2621082663536072,
					elapse_time: 0,
					upper_bound: 1.8181920051574707,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.006734006572514772,
					elapse_time: 0,
					upper_bound: 0.33356809616088867,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.004921005107462406,
					elapse_time: 0,
					upper_bound: 0.30606240034103394,
					tid: '6686725012359481448',
					method_sig:
						'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String, int, int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.9538979530334473,
					elapse_time: 0,
					upper_bound: 4.173043251037598,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OraclePreparedStatement.executeQuery()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002072002040222287,
					elapse_time: 0,
					upper_bound: 0.13848815858364105,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532720655202866,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002590002492070198,
					elapse_time: 0,
					upper_bound: 0.15506765246391296,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OracleStatement.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.008288008160889149,
					elapse_time: 0,
					upper_bound: 0.2802688777446747,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.007511007599532604,
					elapse_time: 0,
					upper_bound: 0.2665385901927948,
					tid: '6686725012359481448',
					method_sig:
						'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String, int, int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 2.0883190631866455,
					elapse_time: 0,
					upper_bound: 8.32247257232666,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OraclePreparedStatement.executeQuery()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0023310023825615644,
					elapse_time: 0,
					upper_bound: 0.14700429141521454,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532966524362564,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.004403004422783852,
					elapse_time: 0,
					upper_bound: 0.20302684605121613,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OracleStatement.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 1.4120694398880005,
					elapse_time: 0,
					upper_bound: 5.63810396194458,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0010360010201111436,
					elapse_time: 0,
					upper_bound: 0.09754882752895355,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_OS_OPEN.10.10.31.219:8080',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 2.5677285194396973,
					elapse_time: 0,
					upper_bound: 27.04547882080078,
					tid: '6686725012359481448',
					method_sig: 'HTTP.call',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.08436910808086395,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_IS_OPEN.10.10.31.219:8080',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.40222740173339844,
					elapse_time: 0,
					upper_bound: 26.959291458129883,
					tid: '6686725012359481448',
					method_sig: 'javax/servlet/jsp/jstl/core/Config.get(ServletRequest, String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.3944573998451233,
					elapse_time: 0,
					upper_bound: 26.51604652404785,
					tid: '6686725012359481448',
					method_sig: 'javax/servlet/jsp/jstl/core/Config.get(ServletContext, String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.003367003286257386,
					elapse_time: 0,
					upper_bound: 0.17715321481227875,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_IS_OPEN.10.10.31.216:15213',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.08436906337738037,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_OS_OPEN.10.10.31.216:15214',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.06630406528711319,
					elapse_time: 0,
					upper_bound: 0.8312434554100037,
					tid: '6686725012359481448',
					method_sig:
						'jeus_jspwork/_WEB_5fINF/_views/_700_LoadFail_5fjsp._jspService(HttpServletRequest, HttpServletResponse)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0010360010201111436,
					elapse_time: 0,
					upper_bound: 0.09754718095064163,
					tid: '6686725012359481448',
					method_sig: 'javax/el/ELContext.putContext(Class, Object)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0031080031767487526,
					elapse_time: 0,
					upper_bound: 0.17009399831295013,
					tid: '6686725012359481448',
					method_sig:
						'javax/servlet/jsp/el/ImplicitObjectELResolver.getValue(ELContext, Object, Object)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.08437245339155197,
					tid: '6686725012359481448',
					method_sig: 'javax/el/ELContext.getContext(Class)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0919450893998146,
					elapse_time: 0,
					upper_bound: 7.16353178024292,
					tid: '6686725012359481448',
					method_sig:
						'javax/servlet/jsp/el/ImplicitObjectELResolver$ImplicitObjects.getImplicitObjects(PageContext)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0023310023825615644,
					elapse_time: 0,
					upper_bound: 0.1470046043395996,
					tid: '6686725012359481448',
					method_sig:
						'javax/servlet/jsp/el/ScopedAttributeELResolver.getValue(ELContext, Object, Object)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.04853253811597824,
					tid: '6686725012359481448',
					method_sig: 'javax/el/ELContext.getContext(Class)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.08437027037143707,
					tid: '6686725012359481448',
					method_sig: 'javax/servlet/http/Cookie.isToken(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.020202020183205605,
					elapse_time: 0,
					upper_bound: 1.5396502017974854,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.update(byte[])',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.10871175676584244,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0647500678896904,
					elapse_time: 0,
					upper_bound: 5.200968265533447,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal(byte[], int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.002072002040222287,
					elapse_time: 0,
					upper_bound: 0.195097416639328,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.056980058550834656,
					elapse_time: 0,
					upper_bound: 4.576169013977051,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0007770007941871881,
					elapse_time: 0,
					upper_bound: 0.1087084412574768,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig:
						'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String, int, int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.005957006011158228,
					elapse_time: 0,
					upper_bound: 0.583017110824585,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OraclePreparedStatement.executeQuery()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/InsensitiveScrollableResultSet.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OracleStatement.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0005180005100555718,
					elapse_time: 0,
					upper_bound: 0.09706640988588333,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048533204942941666,
					tid: '6686725012359481448',
					method_sig:
						'oracle/jdbc/driver/PhysicalConnection.prepareStatement(String, int, int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.05723905563354492,
					elapse_time: 0,
					upper_bound: 5.563119411468506,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OraclePreparedStatement.executeUpdate()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/OracleStatement.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.005439005326479673,
					elapse_time: 0,
					upper_bound: 0.3759326934814453,
					tid: '6686725012359481448',
					method_sig: 'oracle/jdbc/driver/PhysicalConnection.close()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_IS_OPEN.10.10.31.216:15213',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: 'SOCKET_OS_OPEN.10.10.31.216:15213',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048533204942941666,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.getInstance(String)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048533204942941666,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.nextSpi(SecretKeyFactorySpi)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.04853251203894615,
					tid: '6686725012359481448',
					method_sig:
						'jeus_jspwork/_WEB_5fINF/_views/_700_CardCreated_5fjsp._jspService(HttpServletRequest, HttpServletResponse)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.04221704229712486,
					elapse_time: 0,
					upper_bound: 3.754535436630249,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/SecretKeyFactory.generateSecret(KeySpec)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.010878010652959347,
					elapse_time: 0,
					upper_bound: 1.0230969190597534,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.update(byte[])',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0,
					elapse_time: 0,
					upper_bound: 3.000000106112566e-7,
					tid: '6686725012359481448',
					method_sig: '',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.029008029028773308,
					elapse_time: 0,
					upper_bound: 2.583207130432129,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal(byte[], int)',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.0002590002550277859,
					elapse_time: 0,
					upper_bound: 0.048532966524362564,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.chooseFirstProvider()',
				},
				{
					abnormal: false,
					lower_bound: 0,
					mean: 0.02434602379798889,
					elapse_time: 0,
					upper_bound: 2.2409050464630127,
					tid: '6686725012359481448',
					method_sig: 'javax/crypto/Mac.doFinal()',
				},
			],
		};
	},
	// computed: {},
	// watch: {},
	// created() {},
	mounted() {
		this.$nextTick(() => {
			this.$store.dispatch('paramsGlobal/loading_circle_progress', ['fullScreen', false]);

			this.originTree = new OriginTree('origintree', this.$refs.originTractionTreeContainer);

			this.originTree.setData(this.resData);
			this.originTree.draw();

			this.transactionTraceTree = new TransactionTraceTree(
				'transactionTraceTree',
				this.$refs.transactionTreeContainer,
			);

			this.transactionTraceTree.setData(this.resData);
			this.transactionTraceTree.draw();
		});
	},
	beforeDestroy() {
		this.transactionTraceTree.destroy();
		this.originTree.destroy();
		this.originTree = null;
		this.transactionTraceTree = null;
	},
	// destroyed() {},
	// methods: {
	// },
};
</script>
<style lang="scss" scoped>
.anormaly-trasaction-view {
	position: relative;
	display: grid;
	grid-template-rows: 200px auto;
	width: 100%;
	height: 100%;
	border: 1px solid crimson;

	.header {
		display: grid;
		border-bottom: 0.5px solid crimson;
		padding: 5px;
	}

	.contents {
		display: grid;
		grid-template-columns: auto 50%;
		width: 100%;
		height: 100%;
		overflow: hidden;

		.transaction-list {
			border-right: 0.5px solid crimson;
			padding: 5px;
		}

		.transaction-trace {
			padding: 5px;
			overflow: auto;
			width: 100%;
			height: 100%;

			/deep/ .trace-item {
				.trace-item-bg {
					fill: #0000;
				}
			}

			/deep/ .trace-item:hover {
				.trace-item-bg {
					fill: #bd93f933;
				}
			}
		}
	}
}
</style>
