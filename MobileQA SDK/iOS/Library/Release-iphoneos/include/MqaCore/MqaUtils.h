//
//  MqaUtils.h
//  MqaCore
//
//  Created by 이승우 on 2018. 3. 12..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface MqaUtils : NSObject
// Public
+ (NSString *) getTransactionId;
+ (NSString *) getTimeString;
+ (NSString *) getUuid;
+ (NSMutableDictionary *) getDeviceInfoGroup;
+ (NSMutableDictionary *) getOsInfoGroup;
+ (NSMutableDictionary *) getAppInfoGroup;
+ (NSMutableDictionary *) getUsageInfoGroup;

+ (void) postJsonToOracle:(NSString *)url
                     Body:(NSString *)body
         CompletionHander:(void (^)(NSData *data, NSURLResponse *response, NSError *error))completionHandler
          OracleBackendId:(NSString *)oracleBackendId
                OracleKey:(NSString *)oracleKey
                  timeout:(int)sec;

+ (void) postJsonToOracle:(NSString *)url
                     Body:(NSString *)body
         CompletionHander:(void (^)(NSData *data, NSURLResponse *response, NSError *error))completionHandler
          OracleBackendId:(NSString *)oracleBackendId
                OracleKey:(NSString *)oracleKey
                  timeout:(int)sec
                 priority:(float)priority;

// Private
+ (void) getMemoryState:(natural_t *)total Free:(natural_t *)free Used:(natural_t *)used;
+ (float) getCpuUsage;
+ (NSString *) getFilePath:(NSString *)fileName;
@end
