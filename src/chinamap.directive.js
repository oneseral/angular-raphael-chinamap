(function() {
	'use strict';

	angular.module('ChinaMap', []).directive('showmap', function($document) {
		return function($scope, $element, $attr) {
			scope: {
				data: '='
			};

			$scope.$watch('data', function(newValue) {
				$('#' + $element[0].id).html("");
				/*
				 * 配置Raphael生成svg的属性
				 */
				Raphael.getColor.reset();
				var R = Raphael("map", 1000, 800); // 大小与矢量图形文件图形对应；
				var current = null;

				var textAttr = {
					"fill": "#000",
					"font-size": "12px",
					"cursor": "pointer"
				};

				// 调用绘制地图方法
				paintMap(R);

				// ToolTip.html('地图成功绘制！请选择省市').delay(1500).fadeOut('slow');
				$('body').append("<div id='tiplayer' style='display:none'></div>");
				var tiplayer = $('#tiplayer');
				var value = newValue; // 获得数据集

				for (var p in value) {
					if (value[p] && china[p]) {
						china[p].sum = value[p];
					}
				}

				var start = 16777215 / 10;
				var end = 16777215 / 4;
				var i = start;
				var step = (end - start) / 40;
				for (var state in china) {
					i = (i >= end) ? (start) : (i + step);
					// 分省区域着色 16777215
					var color = '#' + (function(h) {
						return new Array(7 - h.length).join("0") + h
					})((Math.floor(i).toString(16)));
					china[state]['path'].color = color;
					// china[state]['path'].animate({fill: china[state]['path'].color, stroke: "#eee" }, 500);
					china[state]['path'].transform("t30,0s1.5,1.5,0,0");
					china[state]['path'].attr({
						fill: china[state]['path'].color
					});
					(function(st, state) {
						// ***获取当前图形的中心坐标
						var xx = st.getBBox().x + (st.getBBox().width / 2);
						var yy = st.getBBox().y + (st.getBBox().height / 2);

						// ***修改部分地图文字偏移坐标
						switch (china[state]['name']) {
							case "江苏":
								xx += 5;
								yy -= 5;
								break;
							case "黑龙江":
								xx += 5;
								yy += 30;
								break;
							case "河北":
								xx -= 10;
								yy += 20;
								break;
							case "天津":
								xx += 20;
								yy += 10;
								break;
							case "上海":
								xx += 20;
								break;
							case "广东":
								yy -= 15;
								break;
							case "澳门":
								yy += 10;
								break;
							case "香港":
								xx += 20;
								yy += 5;
								break;
							case "甘肃":
								xx -= 80;
								yy -= 50;
								break;
							case "陕西":
								xx += 5;
								yy += 30;
								break;
							case "内蒙古":
								xx -= 20;
								yy += 100;
								break;
							default:
						}

						// ***写入地名,并加点击事件,部分区域太小，增加对文字的点击事件
						china[state]['text'] = R.text(xx, yy, (china[state]['name'] + "(" + china[state].sum + ")"))
							.attr(textAttr).click(function() {
								clickMap();
								$(this).hover();
							}).hover(function() {
								var $sl = $("#topList").find("[title='" + china[state]['name'] + "']:not([select])");
								$sl.css("font-size", "20px");
							}, function() {
								var $sl = $("#topList").find("[title='" + china[state]['name'] + "']:not([select])");
								$sl.css("font-size", "");
							});

						// 图形的点击事件
						$(st[0]).click(function(e) {
							clickMap();
						});
						// 鼠标样式
						$(st[0]).css('cursor', 'pointer');
						// 移入事件,显示信息
						$(st[0]).hover(function(e) {
							var _ST = this;

							var $sl = $("#topList").find("[title='" + china[state]['name'] + "']:not([select])");
							if (e.type == 'mouseenter') {
								tiplayer.text((china[state]['name'] + "(" + china[state].sum + ")")).css({
									'opacity': '0.75',
									'top': (e.pageY + 10) + 'px',
									'left': (e.pageX + 10) + 'px'
								}).fadeIn('normal');
								$sl.css("font-size", "20px");
							} else {
								if (tiplayer.is(':animated'))
									tiplayer.stop();
								tiplayer.hide();

								$sl.css("font-size", "");
							}

						});

						function clickMap() {
							if (current == state)
								return;
							// 重置上次点击的图形
							current && china[current]['path'].animate({
								transform: "t30,0s1.5,1.5,0,0",
								fill: china[current]['path'].color,
								stroke: "#ddd"
							}, 2000, "elastic");

							current = state; // 将当前值赋给变量
							// 对本次点击
							china[state]['path'].animate({
								transform: "t30,0s1.51,1.51,0,0",
								fill: china[state]['path'].color,
								stroke: "#000"
							}, 1200, "elastic");
							st.toFront(); // 向上
							R.safari();

							china[current]['text'].toFront(); // ***向上

							if (china[current] === undefined)
								return;

							// $("#topList").find("[title='" + china[current]['name'] + "']").click();
						}
					})(china[state]['path'], state);
				}
			});
		};
	})
})()