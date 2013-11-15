//============================================================================
// Name        : Cannon.cpp
// Author      : 
// Version     :
// Copyright   : Your copyright notice
// Description : Hello World in C++, Ansi-style
//============================================================================

#include <iostream>
#include <string>
#include <unistd.h>
#include <boost/math/constants/constants.hpp>
#include <math.h>

using namespace std;

void print(int xPos, int yPos, bool isA){
	std::string field;
	int xMax = 160;
	int yMax = 35;

	for (int y=yMax; y>=0; --y){
		for (int x=0; x<=xMax; ++x){
			if (x==xPos and y==yPos){
				if((isA and x==xMax) or (!isA and x==0)){
					field.append("X");
				} else {
					field.append("o");
				}
			} else if (x==0 and y==0){
				field.append("A");
			} else if (x==xMax and y==0){
				field.append("B");
			} else {
				field.append(" ");
			}
		}
		field.append("\n");
	}
	std::cout << field << std::endl;
}



int main() {
	cout << "!!!Cannon Game Go!!!" << endl; // prints !!!Hello World!!!

	bool isA = true;
	while(true){
		double alpha = 45;
		double v = 1000;

		std::cout << (isA?"AVel:":"BVel:");
		std::cin >> v;
		std::cout << (isA?"AAng:":"BAng:");
		std::cin >> alpha;

		double rad = alpha*boost::math::constants::pi<double>()/180;

		int i=0;
		int y=0;
		do {
			usleep(50000);
			int x= v* cos(rad)*i;
			y= v* sin(rad)*i - 0.5*9.91*i*i;
			if (isA){
				print(x/1000, y/1000, isA);
			} else {
				print(160 - x/1000, y/1000, isA);
			}
			//std::cout << x << ":" << y << std::endl;
			i++;
		} while (y>=0);

		// switch User
		if (isA){
			isA=false;
		} else {
			isA=true;
		}
	}

	return 0;
}

