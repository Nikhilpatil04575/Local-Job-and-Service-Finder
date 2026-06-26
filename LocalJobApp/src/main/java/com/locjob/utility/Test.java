package com.locjob.utility;

import java.util.Arrays;
import java.util.Comparator;

public class Test {

	public static void main(String[] args) {

		// Second Highest Number from Array
		/*
		 * int arr[] = { -1, 2, -5, 0, 9, 6 }; int largest = Integer.MIN_VALUE; int
		 * secondLargest = Integer.MIN_VALUE;
		 * 
		 * for (int i = 0; i < arr.length; i++) { if (arr[i] > largest) { secondLargest
		 * = largest; largest = arr[i]; } else if (arr[i] > secondLargest && arr[i] !=
		 * largest) { secondLargest = arr[i]; } }
		 * 
		 * System.out.println("Second Largest Value " + secondLargest);
		 */
		Employee[] employees = {
			    new Employee(1, "A", 30000),
			    new Employee(2, "B", 50000),
			    new Employee(3, "C", 40000),
			    new Employee(4, "D", 60000)
			};
		double secondHighestSalary =
		        Arrays.stream(employees)
		              .map(Employee::getSalary)   // extract salaries
		              .distinct()                 // remove duplicate salaries
		              .sorted(Comparator.reverseOrder()) // sort descending
		              .skip(1)                    // skip highest
		              .findFirst()                // get second highest
		              .orElseThrow(() -> new RuntimeException("Not found"));
		
		System.out.println(secondHighestSalary);

	}
}
 class Employee {
	int id;
	String name;
	double salary;

	Employee(int id, String name, double salary) {
		this.id = id;
		this.name = name;
		this.salary = salary;
	}

	public double getSalary() {
		return salary;
	}
}
 
//Singleton class creation  
 class Singleton {

	    private static Singleton instance;

	    // private constructor
	    private Singleton() {
	    }

	    public static Singleton getInstance() {
	        if (instance == null) {
	            instance = new Singleton();
	        }
	        return instance;
	    }
	}
