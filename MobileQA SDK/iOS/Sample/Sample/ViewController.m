//
//  ViewController.m
//  Sample
//
//  Created by 이승우 on 2018. 3. 22..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


//
// Make Crash For Test
//
- (IBAction)onClickCrashButton:(id)sender {
    
    NSArray* array = [NSMutableArray array];
    id object = array;
    [object objectForKey:@"crashKey"];

}

@end
